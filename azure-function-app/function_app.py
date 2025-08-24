import azure.functions as func
import datetime
import json
import os
import logging
from azure.identity import DefaultAzureCredential
from azure.mgmt.trafficmanager import TrafficManagerManagementClient

app = func.FunctionApp()

@app.route(route="FailoverTrigger", auth_level=func.AuthLevel.FUNCTION)
def FailoverTrigger(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    # Lấy config từ App Settings (Terraform sẽ set sẵn)
    subscription_id = os.environ.get("SUBSCRIPTION_ID")
    resource_group  = os.environ.get("RESOURCE_GROUP")
    profile_name    = os.environ.get("PROFILE_NAME")

    if not all([subscription_id, resource_group, profile_name]):
        return func.HttpResponse(
            json.dumps({"status": "error", "message": "Missing required environment variables"}),
            status_code=500,
            mimetype="application/json"
        )
    try:
        # Auth bằng managed identity hoặc service principal
        credential = DefaultAzureCredential()
        client = TrafficManagerManagementClient(credential, subscription_id)

        # Get endpoint hiện tại
        endpoints = list(client.endpoints.list_by_profile(resource_group, profile_name))

        if not endpoints:
            return func.HttpResponse(
                json.dumps({"status": "error", "message": "No endpoints found"}),
                status_code=404,
                mimetype="application/json"
            )

        # Update priority
        updated_endpoints = []
        for ep in endpoints:
            logging.info(f"Processing endpoint: {ep.name}")
            if ep.name == "primary-endpoint":
                new_priority = 2  # Giảm ưu tiên primary
            elif ep.name == "secondary-endpoint":
                new_priority = 1  # Tăng ưu tiên secondary
            else:
                continue

            # Chỉ cập nhật nếu priority thay đổi
            if ep.priority == new_priority:
                logging.info(f"No priority change needed for {ep.name}")
                continue
            
            endpoint_type = ep.type.split("/")[-1]
            logging.info(f"Updating {ep.name} ({endpoint_type}) to priority {new_priority}")

            params = {
                "properties": {
                    "target": ep.target,
                    "priority": new_priority,
                    "endpointStatus": "Enabled",
                    "endpointLocation": ep.endpoint_location
                }
            }

            # Update endpoint với correct case
            client.endpoints.create_or_update(
                resource_group_name=resource_group,
                profile_name=profile_name,
                endpoint_type=endpoint_type, 
                endpoint_name=ep.name,
                parameters=params
            )

            updated_endpoints.append({
                "name": ep.name,
                "priority": new_priority,
                "target": ep.target
            })
            logging.info(f"Updated {ep.name} -> priority {new_priority}")

        return func.HttpResponse(
            json.dumps({
                "status": "success", 
                "message": "Successfully switched to secondary endpoint",
                "updated_endpoints": updated_endpoints
            }),
            status_code=200,
            mimetype="application/json"
        )
    except Exception as e:
        logging.error(f"Error updating Traffic Manager: {str(e)}")
        return func.HttpResponse(
            json.dumps({"status": "error", "message": str(e)}),
            status_code=500,
            mimetype="application/json"
        )

@app.route(route="health")
def health_check(req: func.HttpRequest) -> func.HttpResponse:
    return func.HttpResponse(
        json.dumps({"status": "healthy", "message": "Function is running"}),
        status_code=200,
        mimetype="application/json"
    )