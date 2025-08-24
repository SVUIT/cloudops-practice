#!/bin/sh
# entrypoint.sh

# Dừng ngay lập tức nếu có lỗi
set -e

# Tìm file index.html trong thư mục phục vụ của Nginx
# Sử dụng `find` để đảm bảo tìm thấy file dù tên hash có thay đổi
INDEX_FILE=$(find /usr/share/nginx/html -name 'index.html')

if [ -z "$INDEX_FILE" ]; then
  echo "Lỗi: Không tìm thấy file index.html!"
  exit 1
fi

# Lấy giá trị từ biến môi trường của container.
# Nếu biến API_BASE_URL không được set, sẽ dùng giá trị mặc định.
API_URL_VALUE=${API_BASE_URL:-http://localhost:8080}

echo "Thay thế placeholder __API_BASE_URL__ bằng ${API_URL_VALUE} trong file ${INDEX_FILE}"

# Sử dụng `sed` để tìm và thay thế placeholder.
# Dùng `|` làm delimiter để tránh xung đột nếu URL chứa ký tự `/`.
sed -i "s|__API_BASE_URL__|${API_URL_VALUE}|g" "$INDEX_FILE"

echo "Khởi động Nginx..."
# Chạy lệnh CMD mặc định của image Nginx
exec "$@"
