import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BackgroundImage from "../../assets/images/Homepage Background.png";
import "../../assets/styles/HomePage.module.css";
import { Link } from "react-router-dom";
import { getToken } from "../Login/app/static";
import axios from "axios";
import { postService } from "../../services/postService";
import { userService } from "../../services/userService";
import { toast } from "react-toastify";
import { commentService } from "../../services/commentService";

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socialPosts, setSocialPosts] = useState([]);
  const [loadingSocialPosts, setLoadingSocialPosts] = useState(true);
  const [socialPostsError, setSocialPostsError] = useState(null);

  // Dữ liệu mẫu fallback để dùng khi không lấy được dữ liệu từ API
  const fallbackSocialPosts = [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
      id: 4,
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
      id: 5,
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
      id: 6,
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
      id: 7,
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
      id: 8,
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
        const res = await axios.get(
          "http://localhost:8080/api/products/productCode",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProduct(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
        setProduct([]);
      } finally {
        setLoading(false);
      }
    };

    fetchedProducts();
  }, []);

  // Thêm hàm để tạo avatar dựa trên username
  const generateUserAvatar = (username) => {
    if (!username) return `https://i.pravatar.cc/100?img=1`;

    // Tạo seed ổn định từ username để đảm bảo cùng một username luôn có cùng một avatar
    let seed = 0;
    for (let i = 0; i < username.length; i++) {
      seed = (seed << 5) - seed + username.charCodeAt(i);
      seed = seed & seed; // Convert to 32bit integer
    }

    // Đảm bảo số dương từ 1-10 cho seed
    seed = Math.abs(seed % 10) + 1;
    return `https://i.pravatar.cc/100?img=${seed}`;
  };

  // Fetch posts from API
  useEffect(() => {
    const fetchSocialPosts = async () => {
      try {
        setLoadingSocialPosts(true);
        const posts = await postService.getAllPosts();

        if (posts && posts.length > 0) {
          // Chuyển đổi dữ liệu từ API để khớp với cấu trúc hiển thị
          const formattedPosts = await Promise.all(
            posts.map(async (post) => {
              // Thêm code để lấy avatar từ fullname
              let avatarUrl = post.userAvatar;
              if (!avatarUrl && post.user && post.user !== "null null") {
                // Thử lấy avatar từ API bằng fullname
                try {
                  avatarUrl = await userService.getAvatarFromFullname(
                    post.user
                  );
                  console.log(`Found avatar for ${post.user}:`, avatarUrl);
                } catch (error) {
                  console.error(
                    `Error fetching avatar for ${post.user}:`,
                    error
                  );
                }
              }

              // Đếm chính xác số lượng comment bằng cách lấy từ API thay vì dùng totalComment
              let totalComments = 0;
              try {
                // Gọi API lấy tất cả comment của bài post này
                const comments = await commentService.getCommentsByPostId(
                  post.id
                );
                // Đếm comment cấp cao nhất (chỉ đếm những comment còn active)
                if (Array.isArray(comments)) {
                  const activeComments = comments.filter(
                    (comment) =>
                      comment &&
                      (comment.isActive === true ||
                        comment.isActive === 1 ||
                        comment.active === true ||
                        comment.active === 1)
                  );
                  totalComments = activeComments.length;

                  // Đếm cả các reply trong mỗi comment
                  activeComments.forEach((comment) => {
                    if (comment.replies && Array.isArray(comment.replies)) {
                      // Chỉ đếm các reply còn active
                      const activeReplies = comment.replies.filter(
                        (reply) =>
                          reply &&
                          (reply.isActive === true ||
                            reply.isActive === 1 ||
                            reply.active === true ||
                            reply.active === 1)
                      );
                      totalComments += activeReplies.length;
                    }
                  });
                }
              } catch (error) {
                console.error(
                  `Error fetching comments for post ${post.id}:`,
                  error
                );
                // Nếu có lỗi, sử dụng totalComment từ post data
                totalComments = post.totalComment || 0;
              }

              return {
                id: post.id,
                text: post.content,
                totalComments: totalComments,
                totalLikes: post.totalLiked || 0,
                product: post.imageUrl,
                avatar:
                  avatarUrl ||
                  (post.user
                    ? generateUserAvatar(post.user)
                    : `https://i.pravatar.cc/100?img=${getAvatarSeed(
                        post.userId || post.id
                      )}`),
                username: post.user || "Người dùng",
                userId: post.userId || post.id,
              };
            })
          );

          setSocialPosts(formattedPosts);
        } else {
          // Sử dụng dữ liệu mẫu nếu không có posts
          setSocialPosts(fallbackSocialPosts);
        }
        setSocialPostsError(null);
      } catch (error) {
        console.error("Error fetching social posts:", error);
        setSocialPostsError(error.message);
        setSocialPosts(fallbackSocialPosts); // Fallback to sample data
        toast.error("Không thể tải dữ liệu bài đăng xã hội", {
          autoClose: 3000,
        });
      } finally {
        setLoadingSocialPosts(false);
      }
    };

    fetchSocialPosts();
  }, []);

  const productSettings = {
    dots: false,
    infinite: product.length > 3,
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
    infinite: socialPosts.length > 2,
    lazyLoad: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: Math.ceil(socialPosts.length / 3),
    arrows: false,
    beforeChange: (_, next) => setCurrentSlide(next), // Update current slide
    appendDots: (dots) => (
      <div
        style={{
          position: "relative",
          bottom: "-10px",
        }}
      >
        <ul
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
          }}
        >
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

  // Hiển thị thông tin interactions rõ ràng hơn
  const getCategorizedInteractions = (totalComments, totalLikes) => {
    return (
      <>
        <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
          </svg>
          {totalLikes}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
          </svg>
          {totalComments}
        </span>
      </>
    );
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
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : error ? (
          <p style={{ textAlign: "center", color: "red" }}>{error}</p>
        ) : product.length === 0 ? (
          <p style={{ textAlign: "center" }}>Không có sản phẩm nào</p>
        ) : (
          <Slider {...productSettings}>
            {product.map((item, index) => (
              <Link
                to={`/products/${item.id}`}
                state={{ productCode: item.productCode }}
                key={index}
                className="product-card"
                style={{ padding: "10px" }}
              >
                <div className="product-image" style={{ position: "relative" }}>
                  <img
                    loading="lazy"
                    src={
                      item.imageUrl
                        ? item.imageUrl
                        : "https://media.istockphoto.com/id/1206425636/vector/image-photo-icon.jpg?s=612x612&w=0&k=20&c=zhxbQ98vHs6Xnvnnw4l6Nh9n6VgXLA0mvW58krh-laI="
                    }
                    alt={item.productName}
                    style={{
                      width: "80%",
                      height: "300px",
                      borderRadius: "8px",
                      margin: "0 auto",
                    }}
                  />
                  {item.promotion ? (
                    <span
                      className="product-badge"
                      style={{
                        position: "absolute",
                        top: "5%",
                        left: "15%",
                        backgroundColor: "red",
                        color: "#fff",
                        padding: "5px",
                        borderRadius: "5px",
                      }}
                    >
                      <p className="product-card__promotion bg-red-500 p-1 text-sm w-12 flex justify-center rounded-md font-bold text-white">
                        -{formatPrice(item.promotion.discount * 100)}%
                      </p>
                    </span>
                  ) : (
                    ""
                  )}
                  <div
                    className="card-text"
                    style={{ width: "80%", margin: "0 auto" }}
                  >
                    <p
                      style={{
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.productName}
                    </p>
                    <div className="flex flex-row gap-2 items-center">
                      {item.promotion ? (
                        <p className="product-card__discount-price text-base text-[#021f58] font-extrabold">
                          {formatPrice(
                            item.price - item.price * item.promotion.discount
                          )}
                          đ
                        </p>
                      ) : (
                        <p className="product-card__original-price text-base text-[#021f58] font-extrabold">
                          {formatPrice(item.price)}đ
                        </p>
                      )}
                      {item.promotion ? (
                        <p
                          className="product-card__original-price text-md text-gray-400"
                          style={{ textDecoration: "line-through" }}
                        >
                          {formatPrice(item.price)}đ
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
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
        {loadingSocialPosts ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div className="spinner" />
            <p style={{ marginTop: "10px", color: "#fff" }}>
              Đang tải bài đăng...
            </p>
          </div>
        ) : (
          <Slider {...socialSettings}>
            {socialPosts.map((post, index) => (
              <div key={index} className="social-post">
                <Link
                  to={`/social/post/${post.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    className="post-background"
                    style={{
                      padding: "20px",
                      backgroundColor: "#444",
                      borderRadius: "8px",
                      maxWidth: "600px",
                      width: "70%",
                      margin: "0 auto",
                      cursor: "pointer",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow =
                        "0 10px 20px rgba(0,0,0,0.2)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div
                      className="post-header"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="post-user"
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={post.avatar}
                          alt="avatar"
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            marginRight: "10px",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            // Nếu avatar từ backend lỗi, tạo avatar từ username nếu có
                            e.target.src = post.user
                              ? generateUserAvatar(post.user)
                              : `https://i.pravatar.cc/100?img=${
                                  ((post.userId || post.id) % 10) + 1
                                }`;
                            console.log(
                              `Avatar fallback for user: ${
                                post.user || "unknown"
                              }`
                            );
                          }}
                        />
                        <span>{post.username}</span>
                      </div>
                      <div className="post-date">{post.datePost}</div>
                    </div>

                    {post.product && (
                      <div
                        className="post-image"
                        style={{
                          width: "100%",
                          height: "200px",
                          borderRadius: "8px",
                          overflow: "hidden",
                          marginBottom: "10px",
                        }}
                      >
                        <img
                          src={post.product}
                          alt="product"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.src =
                              "https://media.istockphoto.com/id/1206425636/vector/image-photo-icon.jpg?s=612x612&w=0&k=20&c=zhxbQ98vHs6Xnvnnw4l6Nh9n6VgXLA0mvW58krh-laI=";
                          }}
                        />
                      </div>
                    )}

                    <div
                      className="post-content"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <div
                        className="post-text"
                        style={{
                          whiteSpace: "pre-line",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: "3",
                          WebkitBoxOrient: "vertical",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {post.text}
                      </div>
                      <div
                        className="post-price"
                        style={{
                          fontWeight: "bold",
                          color: "#ffcc00",
                        }}
                      >
                        {post.price}
                      </div>
                      <div
                        className="post-interactions"
                        style={{
                          fontSize: "0.85rem",
                          color: "#aaa",
                          display: "flex",
                          gap: "10px",
                        }}
                      >
                        {getCategorizedInteractions(
                          post.totalComments,
                          post.totalLikes
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};
console.log("HomePage rendered");

export default HomePage;
