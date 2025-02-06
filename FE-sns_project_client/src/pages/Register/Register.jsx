import React from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";

const Register = () => {
    return (
        <div className="container mx-auto px-4 py-12">
            {/* Tiêu đề */}
            <h1 className="text-xl font-bold mb-6 border-b-2 border-black pb-2">Đăng ký</h1>

            <div className="max-w-lg mx-auto p-8 shadow-lg border border-gray-200 rounded-md bg-white">
                {/* Thông tin */}
                <h2 className="text-lg font-medium mb-6 text-center">Thông tin</h2>
                <form>
                    {/* Họ và Tên */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Họ và tên"
                            className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600 shadow-md"
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-6">
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600 shadow-md"
                        />
                    </div>

                    {/* Mật khẩu */}
                    <div className="mb-6">
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600 shadow-md"
                        />
                    </div>

                    {/* Số điện thoại */}
                    <div className="mb-6">
                        <input
                            type="tel"
                            placeholder="Số điện thoại"
                            className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600 shadow-md"
                        />
                    </div>

                    {/* Nút Đăng Ký */}
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 text-sm font-medium shadow-lg"
                    >
                        ĐĂNG KÝ
                    </button>
                </form>

                {/* Hoặc đăng nhập với */}
                <div className="mt-8">
                    <p className="text-center text-sm mb-4 text-gray-500">Hoặc đăng nhập với</p>
                    <div className="flex justify-center space-x-4">
                        {/* Google */}
                        <button className="flex items-center bg-red-600 text-white px-4 py-2 rounded shadow-lg hover:bg-red-500">
                            <FaGoogle className="mr-2" />
                            Google
                        </button>
                        {/* Facebook */}
                        <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-500">
                            <FaFacebook className="mr-2" />
                            Facebook
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
