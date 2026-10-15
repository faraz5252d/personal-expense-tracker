package com.expensetracker.repository;

import com.expensetracker.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, String> {
    Optional<Budget> findByCategoryIdAndMonth(String categoryId, String month);

    @Query("SELECT b FROM Budget b WHERE b.month = :month OR b.month IS NULL")
    List<Budget> findByMonthOrMonthIsNull(@Param("month") String month);
}
