package com.example.ECommerce.Project.V1.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WishlistDTO {

    private Integer id;
    private Integer userId;  // Chỉ trả về ID của người dùng thay vì toàn bộ object User
    private List<Integer> productIds;  // Chỉ trả về danh sách ID của sản phẩm yêu thích

}
