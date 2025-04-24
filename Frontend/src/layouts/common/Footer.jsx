import React from "react";
import { FaFacebook, FaInstagram, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8">
      {/* Đăng ký nhận tin */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Nội dung đăng ký */}
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-semibold mb-2">
              Register for newsletters
            </h3>
            <p className="text-sm">
              Receive promotions and the latest products from us.
            </p>
          </div>

          {/* Form đăng ký */}
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center bg-white text-gray-900 px-4 py-2 rounded-full w-full sm:w-auto">
              <FaEnvelope className="mr-2 text-gray-700" />
              <input
                type="email"
                placeholder="Your email"
                className="bg-transparent focus:outline-none text-sm w-full"
              />
            </div>
            <button className="bg-slate-600 hover:bg-slate-500 px-6 py-2 rounded-full text-sm font-semibold">
              Send
            </button>
          </div>

          {/* Social Links */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="https://facebook.com"
              className="bg-gray-700 hover:bg-gray-600 p-3 rounded-full"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href="https://instagram.com"
              className="bg-gray-700 hover:bg-gray-600 p-3 rounded-full"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={20} />
            </a>
          </div>
        </div>
      </div>

      <hr className="my-8 border-gray-700" />

      {/* Phần thông tin chính */}
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Us */}
        <div>
          <h3 className="text-lg font-semibold mb-4">About Us</h3>
          <ul className="text-sm space-y-2">
            <li>Example Company Name</li>
            <li>"Your slogan here"</li>
            <li>All rights reserved</li>
            <li>/SINCE 2023/</li>
          </ul>
        </div>

        {/* Thông tin liên hệ */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Information</h3>
          <ul className="text-sm space-y-2">
            <li>Address: Ha Noi</li>
            <li>Opening hours: 9:00 AM - 9:00 PM</li>
            <li>Hotline: 0971 871 190</li>
          </ul>
        </div>

        {/* Google Map */}
        <div className="flex justify-center">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.8565368873457!2d105.78081801540288!3d21.038132792836473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab8d1adf93d5%3A0xf5e889315b994105!2zVHJ14bqvbmcsIEjhu41jIMSQw6BvIEtpbmggVGkgxJHhuqVjIMSQw6BvIE3hu5FpIC0gTmF0aW9uYWwgVW5pdmVyc2l0eQ!5e0!3m2!1sen!2s!4v1671562240132!5m2!1sen!2s"
            width="300"
            height="200"
            className="border rounded-lg shadow-lg"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* Danh mục */}
      <div className="container mx-auto px-4 mt-8">
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center text-sm font-semibold">
          <li>Trend</li>
          <li>Best Seller</li>
          <li>Discount</li>
          <li>News</li>
          <li>Contact</li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
