# TECOTEC Technologies — Brand Playbook v1.0

> **Brand Voice & Identity Playbook** · Site tĩnh triển khai trên GitHub Pages

🔗 **Live site:** [mkt-tecotec.github.io/T3-Brand-Playbook](https://mkt-tecotec.github.io/T3-Brand-Playbook/)

---

## Giới thiệu

Đây là tài liệu hướng dẫn nhận diện và giọng điệu thương hiệu chính thức của **TECOTEC Technologies (T3)**. Playbook bao gồm 15 phần, từ nền tảng thương hiệu, nhận diện thị giác, đến quy tắc viết và vận hành nội dung.

Site được xây dựng bằng **HTML + CSS + JavaScript thuần**, không phụ thuộc framework, tối ưu cho tốc độ tải và trải nghiệm đọc. Nội dung hỗ trợ tiếng Việt và tiếng Anh từ một nguồn JSON song ngữ.

---

## Nội dung

| # | Phần | Mô tả |
|---|------|-------|
| 01 | Giới thiệu | Mục đích, đối tượng sử dụng |
| 02 | Nền tảng thương hiệu | Sứ mệnh, tầm nhìn, giá trị cốt lõi |
| 03 | Nhận diện thị giác | Logo, màu sắc, typography, hình ảnh, biểu tượng |
| 04 | Cá tính thương hiệu | 5 đặc điểm định vị tính cách |
| 05 | Giọng điệu & Ngôn ngữ | Tone matrix theo ngữ cảnh |
| 06 | Bộ lọc nội dung | Checklist kiểm tra trước khi xuất bản |
| 07 | Quy tắc viết | Ngữ pháp, thuật ngữ, cấu trúc câu |
| 08 | Viết kỹ thuật | Template AppNote, Report, Product Sheet |
| 09 | Khung Case Study | Cấu trúc 6 phần chuẩn |
| 10 | Giọng Proposal & RFP | Cách viết đề xuất và phản hồi |
| 11 | AI Content Guardrails | Quy định sử dụng AI trong sản xuất nội dung |
| 12 | Hướng dẫn theo kênh | Web, LinkedIn, Email, Career page |
| 13 | Ma trận ứng phó | L0–L3 response matrix |
| 14 | Nên & Không nên | Bộ quy tắc tổng hợp |
| 15 | Tham khảo nhanh | Cheat sheet in được |

---

## Tính năng

- 🎨 **Bảng màu tương tác** — click để copy HEX code, kèm gallery tham khảo
- 📥 **Tải logo** — 9 định dạng: SVG (3 variants) + PNG (3 variants) + WebP + PDF + AI
- 🖼️ **Image galleries** — Color reference, Pattern, Typography, Logo Usage, Image Style
- 📁 **Tải source files** — Color.ai, TYPO.ai, Logo-usage.ai, Image-style.ai, Overview.ai
- 🔤 **Nút tải font** — link trực tiếp tới Google Fonts (Inter)
- ✅ **Checklist bộ lọc nội dung** — tích các tiêu chí trước khi đăng
- 📌 **Navigation scroll-spy** — sidebar highlight section đang xem
- 🖨️ **In trang tham khảo** — quick reference card tối ưu in ấn
- 📱 **Responsive** — sidebar collapse trên mobile
- 🌐 **Song ngữ VI/EN** — chuyển ngôn ngữ không tải lại trang, hỗ trợ link `?lang=en#section`

---

## Tài nguyên logo

| File | Định dạng | Dùng cho |
|------|-----------|---------|
| `logo-TECOTEC-Technologies.svg` | SVG | Web, in ấn chất lượng cao |
| `logo-TECOTEC-Technologies-white.svg` | SVG trắng | Nền tối, hero, video overlay |
| `logo-TECOTEC-Technologies-black.svg` | SVG đen | Ấn phẩm đơn sắc |
| `logo-TECOTEC-Technologies.png` | PNG | Presentation, email |
| `logo-TECOTEC-Technologies-white.png` | PNG trắng | Nền tối |
| `logo-TECOTEC-Technologies-black.png` | PNG đen | Đơn sắc |
| `Logo-TECOTEC-Technologies.webp` | WebP | Web, tối ưu tốc độ |
| `Logo TECOTEC Technologies.pdf` | PDF | In ấn chuyên nghiệp |
| `Logo-TECOTEC-Technologies.ai` | AI | Chỉnh sửa vector |

---

## Tech stack

```
index.html    — HTML shell và 15 section placeholder
content.json — Nội dung song ngữ, mỗi khóa chứa cặp vi/en
i18n.js      — Nạp nội dung, lưu lựa chọn và đồng bộ URL
styles.css   — Design system (CSS custom properties), responsive, print
main.js      — Scroll spy, clipboard, checklist, mobile nav, modal, scroll reveal
```

**Font:** Inter (Google Fonts)  
**Không dùng** framework JS hoặc CSS library nào.

## Cập nhật nội dung song ngữ

Mọi nội dung hiển thị được quản lý trong `content.json`. Khi cập nhật một khóa, sửa đồng thời hai trường `vi` và `en` trong cùng bản ghi. Không thêm nội dung trực tiếp vào các phần tử có `data-i18n` hoặc `data-i18n-html` trong `index.html`.

Chạy kiểm tra trước khi commit:

```bash
node scripts/validate-i18n.mjs
```

Script sẽ báo khóa thiếu, khóa thừa, bản tiếng Anh còn sót tiếng Việt và đường dẫn tài nguyên lệch giữa hai ngôn ngữ.

---

## Triển khai

Site được deploy tự động qua **GitHub Pages** từ nhánh `main`.

Để cập nhật nội dung:
```bash
# 1. Chỉnh sửa content.json hoặc mã giao diện liên quan
# 2. Kiểm tra i18n
node scripts/validate-i18n.mjs
# 3. Commit và push
git add .
git commit -m "chore: cập nhật nội dung [mô tả thay đổi]"
git push origin main
# 4. GitHub Pages tự động deploy trong ~2–5 phút
```

---

## Quy ước commit

```
feat:   thêm tính năng mới
fix:    sửa lỗi
chore:  cập nhật nội dung, tài sản
style:  thay đổi CSS/UI không ảnh hưởng logic
docs:   cập nhật tài liệu
```

---

## Liên hệ

**TECOTEC Technologies**  
📧 info@tecotec.tech  
🌐 [tecotec.tech](https://tecotec.tech)

---

*Brand Playbook v1.0 · Tháng 4/2026 · Phòng Marketing TECOTEC Group*
