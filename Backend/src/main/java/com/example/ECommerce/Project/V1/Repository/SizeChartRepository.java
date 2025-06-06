package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.SizeChart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SizeChartRepository extends JpaRepository<SizeChart, Integer> {

    @Query("SELECT DISTINCT s.sizeChartType FROM SizeChart s")
    List<String> findDistinctSizeChartTypes();

    @Query("SELECT s.value FROM SizeChart s WHERE s.sizeChartType = :type")
    List<String> findValuesBySizeChartType(@Param("type") String type);

    Boolean existsSizeChartByValue(String value);
}
