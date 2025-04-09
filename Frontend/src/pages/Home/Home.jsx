import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BackgroundImage from "../../assets/images/Homepage Background.png";
import "../../assets/styles/HomePage.module.css";
import { Link } from "react-router-dom";
import { getToken } from "../Login/app/static";
import axios from "axios";
const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const featuredProducts = [
  //   {
  //     caterogy: "Jackets",
  //     image:
  //       "https://th.bing.com/th/id/R.ba0c20bf7ae2403c7198c8724cf85211?rik=gTi6e%2bUBXHgD3A&pid=ImgRaw&r=0",
  //     name: "Áo Khoác Da Nam",
  //     price: "2.500.000 VND",
  //   },
  //   {
  //     caterogy: "Jackets",
  //     image:
  //       "https://th.bing.com/th/id/OIP.vTBXLmh4B7SDbFwl1CFh4gHaHa?rs=1&pid=ImgDetMain",
  //     name: "Áo Khoác Bomber Nam",
  //     price: "1.500.000 VND",
  //   },
  //   {
  //     caterogy: "Jackets",
  //     image:
  //       "https://th.bing.com/th/id/OIP.uoeehBYUCBEZbe4qRGZWfAHaJ4?w=750&h=1000&rs=1&pid=ImgDetMain",
  //     name: "Áo Khoác Dù Nam",
  //     price: "800.000 VND",
  //   },
  //   {
  //     caterogy: "Jackets",
  //     image:
  //       "https://i.pinimg.com/originals/da/43/9f/da439f75b3347e05290d7046bed2bef9.jpg",
  //     name: "Áo Khoác Jean Nam",
  //     price: "1.200.000 VND",
  //   },
  //   {
  //     caterogy: "Jackets",
  //     image:
  //       "https://i.pinimg.com/originals/7d/eb/40/7deb40caf86d35196f4680ddf4d9241f.jpg",
  //     name: "Áo Khoác Kaki Nam",
  //     price: "900.000 VND",
  //   },
  // ];

  const socialPosts = [
    {
      text: "🔥 PASS LẠI ÁO CỰC BAY 🔥",
      price: "💸 Giá pass cực mềm: [99k]",
      interactions: "110 replies · 110 likes",
      datePost: "1 giờ trước",
      avatar:
        "https://th.bing.com/th/id/R.ba0c20bf7ae2403c7198c8724cf85211?rik=gTi6e%2bUBXHgD3A&pid=ImgRaw&r=0",
      product:
        "https://th.bing.com/th/id/R.ba0c20bf7ae2403c7198c8724cf85211?rik=gTi6e%2bUBXHgD3A&pid=ImgRaw&r=0",
    },
    {
      text: "🔥 PASS LẠI ÁO CỰC BAY 🔥",
      price: "💸 Giá pass cực mềm: [99k]",
      interactions: "110 replies · 110 likes",
      datePost: "1 giờ trước",
      avatar:
        "https://th.bing.com/th/id/R.ba0c20bf7ae2403c7198c8724cf85211?rik=gTi6e%2bUBXHgD3A&pid=ImgRaw&r=0",
      product:
        "https://th.bing.com/th/id/R.ba0c20bf7ae2403c7198c8724cf85211?rik=gTi6e%2bUBXHgD3A&pid=ImgRaw&r=0",
    },
    {
      text: "🔥 PASS LẠI ÁO CỰC BAY 🔥",
      price: "💸 Giá pass cực mềm: [99k]",
      interactions: "110 replies · 110 likes",
      datePost: "1 giờ trước",
      avatar:
        "https://th.bing.com/th/id/R.ba0c20bf7ae2403c7198c8724cf85211?rik=gTi6e%2bUBXHgD3A&pid=ImgRaw&r=0",
      product:
        "https://th.bing.com/th/id/R.ba0c20bf7ae2403c7198c8724cf85211?rik=gTi6e%2bUBXHgD3A&pid=ImgRaw&r=0",
    },
    {
      text: "🔥 PASS LẠI ÁO CỰC BAY 🔥",
      price: "💸 Giá pass cực mềm: [99k]",
      interactions: "110 replies · 110 likes",
      datePost: "1 giờ trước",
      avatar:
        "https://i.pinimg.com/originals/da/43/9f/da439f75b3347e05290d7046bed2bef9.jpg",
      product:
        "https://th.bing.com/th/id/R.ba0c20bf7ae2403c7198c8724cf85211?rik=gTi6e%2bUBXHgD3A&pid=ImgRaw&r=0",
    },
    {
      text: "🔥 PASS LẠI ÁO CỰC BAY 🔥",
      price: "💸 Giá pass cực mềm: [99k]",
      interactions: "110 replies · 110 likes",
      datePost: "1 giờ trước",
      avatar:
        "https://i.pinimg.com/originals/da/43/9f/da439f75b3347e05290d7046bed2bef9.jpg",
      product:
        "https://th.bing.com/th/id/R.ba0c20bf7ae2403c7198c8724cf85211?rik=gTi6e%2bUBXHgD3A&pid=ImgRaw&r=0",
    },
    {
      text: "🔥 PASS LẠI ÁO CỰC BAY 🔥",
      price: "💸 Giá pass cực mềm: [99k]",
      interactions: "110 replies · 110 likes",
      datePost: "1 giờ trước",
      avatar:
        "https://i.pinimg.com/originals/da/43/9f/da439f75b3347e05290d7046bed2bef9.jpg",
      product:
        "https://th.bing.com/th/id/R.ba0c20bf7ae2403c7198c8724cf85211?rik=gTi6e%2bUBXHgD3A&pid=ImgRaw&r=0",
    },
    {
      text: "🔥 PASS LẠI ÁO CỰC BAY 🔥",
      price: "💸 Giá pass cực mềm: [99k]",
      interactions: "110 replies · 110 likes",
      datePost: "1 giờ trước",
      avatar:
        "https://i.pinimg.com/originals/da/43/9f/da439f75b3347e05290d7046bed2bef9.jpg",
      product:
        "https://th.bing.com/th/id/R.ba0c20bf7ae2403c7198c8724cf85211?rik=gTi6e%2bUBXHgD3A&pid=ImgRaw&r=0",
    },
    {
      text: "🔥 PASS LẠI ÁO CỰC BAY 🔥",
      price: "💸 Giá pass cực mềm: [99k]",
      interactions: "110 replies · 110 likes",
      datePost: "1 giờ trước",
      avatar:
        "https://i.pinimg.com/originals/da/43/9f/da439f75b3347e05290d7046bed2bef9.jpg",
      product:
        "https://th.bing.com/th/id/R.ba0c20bf7ae2403c7198c8724cf85211?rik=gTi6e%2bUBXHgD3A&pid=ImgRaw&r=0",
    },
    {
      text: "🔥 PASS LẠI ÁO CỰC BAY 🔥",
      price: "💸 Giá pass cực mềm: [99k]",
      interactions: "110 replies · 110 likes",
      datePost: "1 giờ trước",
      avatar:
        "https://i.pinimg.com/originals/da/43/9f/da439f75b3347e05290d7046bed2bef9.jpg",
      product:
        "https://th.bing.com/th/id/R.ba0c20bf7ae2403c7198c8724cf85211?rik=gTi6e%2bUBXHgD3A&pid=ImgRaw&r=0",
    },
  ];

  useEffect(() => {
    const fetchedProducts = async () => {
      try {
        const token = getToken();
        const res = await axios.get("http://localhost:8080/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProduct(res.data);
        console.log("Product", res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchedProducts();
  }, []);

  const productSettings = {
    dots: false,
    infinite: true,
    speed: 2000,
    slidesToShow: 4,
    slidesToScroll: product.length / 4,
    centerMode: true, // Enable center alignment
    centerPadding: "10px", // Adjust padding around the center slide
    // nextArrow: <NextArrow />,
    // prevArrow: <PrevArrow />,
    autoplay: true,
    autoplaySpeed: 800,
    cssEase: "linear",
    // responsive: [
    //   {
    //     breakpoint: 1024,
    //     settings: {
    //       slidesToShow: 3,
    //       slidesToScroll: 1,
    //       centerPadding: "20px", // Adjust for smaller screens
    //     },
    //   },
    //   {
    //     breakpoint: 768,
    //     settings: {
    //       slidesToShow: 2,
    //       slidesToScroll: 1,
    //       centerPadding: "30px", // Adjust for smaller screens
    //     },
    //   },
    //   {
    //     breakpoint: 480,
    //     settings: {
    //       slidesToShow: 1,
    //       slidesToScroll: 1,
    //       centerPadding: "40px", // Adjust for smaller screens
    //     },
    //   },
    // ],
  };

  const socialSettings = {
    dots: true,
    dotsClass: "slick-dots",
    infinite: true,
    lazyLoad: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: socialPosts.length / 3,
    arrows: false,
    beforeChange: (_, next) => setCurrentSlide(next), // Update current slide
    appendDots: (dots) => (
      <div
        style={{
          position: "relative",
          bottom: "-10px",
        }}
      >
        <ul style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          {dots}
        </ul>
      </div>
    ),
    customPaging: (index) => (
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor:
            index >= currentSlide / 3 && index < currentSlide / 3 + 1
              ? "black"
              : "white", // Highlight dots for the current slide
          transition: "background-color 0.3s ease",
        }}
      />
    ),
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center" }}>
        <div className="spinner" /> {/* Thêm spinner */}
        Loading...
      </div>
    );
  }

  if (error) {
    return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  }

  return (
    <div className="homepage-outline">
      {/* Header Section */}
      <div className="header-section">
        <img src={BackgroundImage} alt="background" width="100%" />
      </div>

      {/* Featured Products Section */}
      <div
        className="featured-products-section"
        style={{
          padding: "40px",
          marginTop: "20px",
          backgroundColor: "#E9E9E9",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>SẢN PHẨM NỔI BẬT</h2>
        {product.length === 0 ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : (
          <Slider {...productSettings}>
            {product.map((item, index) => (
              <Link
                to={`/products/${item.id}`}
                key={index}
                className="product-card"
                style={{ padding: "10px" }}
              >
                <div className="product-image" style={{ position: "relative" }}>
                  <img
                    loading="lazy"
                    src={item.imageUrl ? item.imageUrl : "https://media.istockphoto.com/id/1206425636/vector/image-photo-icon.jpg?s=612x612&w=0&k=20&c=zhxbQ98vHs6Xnvnnw4l6Nh9n6VgXLA0mvW58krh-laI="}
                    alt={`Product ${item}`}
                    style={{
                      width: "80%",
                      height: "300px",
                      borderRadius: "8px",
                      margin: "0 auto",
                    }}
                  />
                  <span
                    className="product-badge"
                    style={{
                      position: "absolute",
                      top: "5%",
                      left: "15%",
                      backgroundColor: "red",
                      color: "#fff",
                      padding: "5px 10px",
                      borderRadius: "5px",
                    }}
                  >
                    HOT
                  </span>
                  <div
                    className="card-text"
                    style={{ width: "80%", margin: "0 auto" }}
                  >
                    <p>{item.productName}</p>
                    <p>{formatPrice(item.price)}đ</p>
                  </div>
                </div>
              </Link>
            ))}
          </Slider>
        )}
      </div>

      {/* Social Section */}
      <div
        className="social-section"
        style={{ padding: "20px", backgroundColor: "#333", color: "#fff" }}
      >
        <h2 style={{ marginBottom: "20px", paddingLeft: "20px" }}>SOCIAL</h2>
        <Slider {...socialSettings}>
          {socialPosts.map((post, index) => (
            <div key={index} className="social-post">
              <div
                className="post-background"
                style={{
                  padding: "20px",
                  backgroundColor: "#444",
                  borderRadius: "8px",
                  maxWidth: "600px",
                  width: "70%",
                  margin: "0 auto",
                }}
              >
                <div
                  className="post-header"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    className="post-user"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <img
                      src={post.avatar}
                      alt="avatar"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        marginRight: "10px",
                      }}
                    />
                    <span>Nguyễn Văn A</span>
                  </div>
                  <div className="post-date">{post.datePost}</div>
                </div>
                <div
                  className="post-content"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div className="post-content-left">
                    <p>{post.text}</p>
                    <p>{post.price}</p>
                    <p>{post.interactions}</p>
                  </div>
                  <div
                    className="post-content-right"
                    style={{ marginLeft: "20px", width: "15%" }}
                  >
                    <img src={post.product} alt="post" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};
console.log("HomePage rendered");

export default HomePage;
