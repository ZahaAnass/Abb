package com.abb.Abb.service;

import com.abb.Abb.entity.Client;
import com.abb.Abb.entity.Transaction;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ExcelService {

    public byte[] genererReleveExcel(Client client, List<Transaction> transactions) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Relevé Bancaire");

            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            sheet.createRow(0).createCell(0).setCellValue("Titulaire du compte : " + client.getName());
            sheet.createRow(1).createCell(0).setCellValue("RIB : " + client.getRib());
            sheet.createRow(2).createCell(0).setCellValue("Solde actuel : " + client.getSolde() + " MAD");

            Row headerRow = sheet.createRow(4);
            String[] columns = {"Date", "Description", "Type", "Montant (MAD)"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
            int rowIdx = 5;

            for (Transaction t : transactions) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(t.getTransactionDate().format(formatter));
                row.createCell(1).setCellValue(t.getDescription() != null ? t.getDescription() : "Virement");

                if (t.getSenderRib().equals(client.getRib())) {
                    row.createCell(2).setCellValue("Envoyé à: " + t.getReceiverRib());
                    row.createCell(3).setCellValue("-" + t.getAmount().toString());
                } else {
                    row.createCell(2).setCellValue("Reçu de: " + t.getSenderRib());
                    row.createCell(3).setCellValue("+" + t.getAmount().toString());
                }
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();

        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de la génération du fichier Excel", e);
        }
    }
}