import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <p className="text-8xl font-bold text-red-600 mb-4">404</p>
      <h1 className="text-2xl font-semibold mb-2">Trang không tồn tại</h1>
      <p className="text-gray-500 mb-6">Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      <Link href="/" className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
        Về trang chủ
      </Link>
    </div>
  );
}
