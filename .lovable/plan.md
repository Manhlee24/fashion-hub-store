

# MENSWEAR - Website Thời Trang Nam

## Tổng quan
Website thương mại điện tử thời trang nam với phong cách tối giản & hiện đại (đen, trắng, xám). Sử dụng Lovable Cloud (Supabase) làm backend. Gồm 2 phần: Storefront cho khách hàng và Admin Dashboard cho quản trị.

---

## Database Schema

### Bảng dữ liệu:
- **profiles**: id, name, email (liên kết auth.users)
- **user_roles**: id, user_id, role (admin/customer) — bảng riêng cho bảo mật
- **categories**: id, category_name, created_at
- **products**: id, product_name, price, description, image_url, category_id, is_featured, created_at
- **orders**: id, user_id, receiver_name, phone, address, total_amount, status (pending/confirmed/shipping/completed/cancelled), created_at
- **order_items**: id, order_id, product_id, quantity, unit_price
- **banners**: id, image_url, is_active, sort_order

---

## Storefront (Giao diện khách hàng)

### Trang chủ
- Header: Logo MENSWEAR, navigation (Trang chủ, Sản phẩm, Danh mục), icon giỏ hàng với badge số lượng, nút Đăng nhập/Tài khoản
- Banner carousel quảng cáo (từ bảng banners)
- Section sản phẩm nổi bật (is_featured) và sản phẩm mới nhất
- Footer với thông tin cửa hàng

### Trang danh sách sản phẩm
- Grid sản phẩm responsive (4 cột desktop, 2 cột mobile)
- Sidebar/dropdown lọc theo danh mục
- Card sản phẩm: ảnh, tên, giá

### Trang chi tiết sản phẩm
- Ảnh lớn, tên, giá, mô tả chi tiết
- Nút "Thêm vào giỏ hàng" với chọn số lượng

### Giỏ hàng
- Danh sách sản phẩm trong giỏ (lưu localStorage, sync khi login)
- Cập nhật số lượng, xóa sản phẩm
- Tổng tiền tạm tính
- Nút "Thanh toán" (yêu cầu đăng nhập)

### Trang Checkout (yêu cầu login)
- Form: Tên người nhận, SĐT, Địa chỉ
- Tóm tắt đơn hàng
- Phương thức: COD (mặc định)
- Validation đầy đủ các trường

### Đăng ký / Đăng nhập
- Đăng ký: Họ tên, Email, Mật khẩu
- Đăng nhập: Email, Mật khẩu
- Sử dụng Supabase Auth với JWT

### Trang cá nhân
- Lịch sử đơn hàng với trạng thái (badge màu)
- Xem chi tiết từng đơn hàng

---

## Admin Dashboard (/admin)

### Bảo mật
- Chỉ user có role "admin" mới truy cập được
- Redirect về trang chủ nếu không phải admin

### Trang tổng quan
- Thống kê nhanh: tổng đơn hàng, doanh thu, số sản phẩm

### Quản lý Danh mục (CRUD)
- Bảng danh sách, thêm/sửa/xóa danh mục

### Quản lý Sản phẩm (CRUD)
- Bảng danh sách sản phẩm
- Form thêm/sửa: Tên, Giá, Mô tả, URL ảnh, Chọn danh mục, Đánh dấu nổi bật

### Quản lý Đơn hàng
- Danh sách đơn hàng (lọc theo trạng thái)
- Xem chi tiết đơn: thông tin khách, danh sách sản phẩm, tổng tiền, địa chỉ giao
- Cập nhật trạng thái đơn hàng (duyệt, giao, hoàn thành, hủy)

### Quản lý Banner
- Thêm/sửa/xóa banner (URL ảnh, bật/tắt active)

---

## Design
- **Màu sắc**: Đen (#000), Trắng (#fff), Xám các tone — tối giản, nam tính
- **Typography**: Font sans-serif sạch sẽ, heading đậm
- **Layout**: Responsive — desktop sidebar admin, mobile hamburger menu
- **Spacing**: Nhiều khoảng trắng, card sản phẩm clean

