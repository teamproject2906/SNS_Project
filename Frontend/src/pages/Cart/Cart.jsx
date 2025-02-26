import React, { useState } from 'react';

function Cart(props) {
    // Khởi tạo trạng thái cho từng sản phẩm và tổng tiền
    const [products, setProducts] = useState([
        { id: 1, name: 'Áo bomber da rắn - XL', price: 1600000, quantity: 1, imageUrl: 'https://pos.nvncdn.com/eb4d49-63924/ps/20250121_OEl83gYeOZ.jpeg' },
        { id: 2, name: 'Quần wide pants đồng công RED waxed - XL', price: 1100000, quantity: 1, imageUrl: 'https://pos.nvncdn.com/eb4d49-63924/ps/20241227_pRfDe8qR9j.jpeg' }
    ]);

    // Tính toán tổng tiền
    const total = products.reduce((acc, product) => acc + product.price * product.quantity, 0);

    // Hàm cập nhật số lượng sản phẩm
    const updateQuantity = (id, quantity) => {
        setProducts(products.map(product =>
            product.id === id ? { ...product, quantity: quantity } : product
        ));
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between space-x-8">
                <div className="w-3/5">
                    <h1 className="text-2xl font-bold mb-8 text-center">Giỏ hàng</h1>
                    <hr className='mb-10'/>
                    <div className="space-y-6">
                        {products.map(product => (
                            <div key={product.id} className="flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    <img src={product.imageUrl} alt={`${product.name}`} className="w-32 h-32 object-cover"/>
                                    <div>
                                        <h3 className="text-xl font-semibold">{product.name}</h3>
                                        <p className="text-gray-700">Giá: {product.price.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input 
                                        type="number" 
                                        className="form-input border w-16 text-center" 
                                        value={product.quantity}
                                        onChange={(e) => updateQuantity(product.id, Math.max(0, parseInt(e.target.value)))}
                                    />
                                    <span>x</span>
                                    <span className="text-gray-800 font-semibold">{(product.price * product.quantity).toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-2/5 bg-white p-8 shadow-lg">
                    <h2 className="text-2xl font-bold mb-6">Thông tin</h2>
                    <div className="mb-6">
                        <p className="text-gray-600">Tạm tính</p>
                        <p className="text-xl font-semibold">{total.toLocaleString()}</p>
                    </div>
                    <div className="mb-6">
                        <p className="text-gray-600">Chưa bao gồm phí vận chuyển</p>
                    </div>
                    <div>
                        <p className="text-xl font-semibold">Tổng tiền</p>
                        <p className="text-2xl font-bold">{total.toLocaleString()}</p>
                    </div>
                    <div className="mt-8">
                        <button className="w-full py-3 bg-black text-white text-lg font-semibold">THANH TOÁN</button>
                        <button className="w-full py-3 mt-4 border border-gray-400 text-gray-600 text-lg">TIẾP TỤC MUA HÀNG</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
