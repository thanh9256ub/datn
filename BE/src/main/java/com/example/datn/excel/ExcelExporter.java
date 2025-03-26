package com.example.datn.excel;

import com.example.datn.entity.Product;
import com.example.datn.entity.ProductDetail;
import com.example.datn.repository.ProductDetailRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

public class ExcelExporter {
    private XSSFWorkbook workbook;
    private XSSFSheet sheet;
    private List<Product> productList;
    private ProductDetailRepository productDetailRepository;

    public ExcelExporter(List<Product> productList, ProductDetailRepository productDetailRepository) {
        this.productList = productList;
        this.productDetailRepository = productDetailRepository;
        this.workbook = new XSSFWorkbook();
    }

    private void writeHeader() {
        sheet = workbook.createSheet("Products");
        Row row = sheet.createRow(0);
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);

        String[] headers = { "Tên sản phẩm", "Thương hiệu", "Danh mục", "Chất liệu", "Mô tả", "Màu sắc", "Kích cỡ", "Số lượng", "Giá" };
        for (int i = 0; i < headers.length; i++) {
            Cell cell = row.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(style);
            sheet.autoSizeColumn(i);
        }
    }

    private void writeData() {
        int rowCount = 1;

        for (Product product : productList) {
            List<ProductDetail> details = productDetailRepository.findByProduct(product);

            if (details.isEmpty()) {
                Row row = sheet.createRow(rowCount++);
                writeProductRow(row, product, null);
            } else {
                for (ProductDetail detail : details) {
                    Row row = sheet.createRow(rowCount++);
                    writeProductRow(row, product, detail);
                }
            }
        }
    }

    private void writeProductRow(Row row, Product product, ProductDetail detail) {
        row.createCell(0).setCellValue(product.getProductName());
        row.createCell(1).setCellValue(product.getBrand().getBrandName());
        row.createCell(2).setCellValue(product.getCategory().getCategoryName());
        row.createCell(3).setCellValue(product.getMaterial().getMaterialName());
        row.createCell(4).setCellValue(product.getDescription());

        if (detail != null) {
            row.createCell(5).setCellValue(detail.getColor().getColorName());
            row.createCell(6).setCellValue(detail.getSize().getSizeName());
            row.createCell(7).setCellValue(detail.getQuantity());
            row.createCell(8).setCellValue(detail.getPrice());
        } else {
            row.createCell(5).setCellValue("N/A");
            row.createCell(6).setCellValue("N/A");
            row.createCell(7).setCellValue(0);
            row.createCell(8).setCellValue(0.0);
        }
    }

    public void export(HttpServletResponse response) throws IOException {
        writeHeader();
        writeData();

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=products.xlsx");

        try (ServletOutputStream outputStream = response.getOutputStream()) {
            workbook.write(outputStream);
        } finally {
            workbook.close();
        }
    }
}
