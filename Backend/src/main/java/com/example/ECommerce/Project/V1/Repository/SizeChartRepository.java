package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.SizeChart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SizeChartRepository extends JpaRepository<SizeChart, Integer> {
    boolean existsBySizeChartType(String sizeChartType);
    boolean existsById(Integer id);

    @Query("SELECT s FROM SizeChart s WHERE s.isActive = true")
    List<SizeChart> getActiveSizeChart();
}
