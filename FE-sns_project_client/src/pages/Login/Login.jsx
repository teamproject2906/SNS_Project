import React from "react";
import { Link } from "react-router-dom";
import { FaLock } from "react-icons/fa";

const Login = () => {
    return (
        <div className="container mx-auto px-4 py-12">
            {/* Tiêu đề */}
            <h1 className="text-xl font-bold mb-6 border-b pb-2">Đăng nhập</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form Đăng Nhập */}
                <div className="p-6 shadow-lg border rounded-md">
                    <h2 className="text-lg font-semibold mb-4">Thông tin</h2>
                    <form>
                        {/* Email */}
                        <div className="mb-4">
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Email"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700"
                            />
                        </div>

                        {/* Mật khẩu */}
                        <div className="mb-4">
                            <label htmlFor="password" className="sr-only">
                                Mật khẩu
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Mật khẩu"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700"
                            />
                        </div>

                        {/* Nút Đăng Nhập */}
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 text-sm font-semibold"
                        >
                            ĐĂNG NHẬP
                        </button>
                    </form>

                    {/* Quên Mật Khẩu */}
                    <div className="mt-4 text-sm">
                        <Link to="/forgot-password" className="flex items-center hover:underline">
                            <FaLock className="mr-1" />
                            Quên mật khẩu
                        </Link>
                    </div>
                </div>

                {/* Đăng Ký Tài Khoản */}
                <div className="p-6 shadow-lg border rounded-md">
                    <h2 className="text-lg font-semibold mb-4">Đăng kí tài khoản mới</h2>
                    <p className="text-sm mb-6">
                        Đăng ký tài khoản ngay để có thể mua hàng nhanh chóng và dễ dàng hơn! Ngoài ra
                        còn có rất nhiều chính sách và ưu đãi cho các thành viên.
                    </p>
                    <Link
                        to="/register"
                        className="block bg-black text-white py-2 rounded-md text-center hover:bg-gray-800 text-sm font-semibold"
                    >
                        TẠO TÀI KHOẢN
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
