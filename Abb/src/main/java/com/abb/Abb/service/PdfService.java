package com.abb.Abb.service;

import com.abb.Abb.entity.Client;
import com.abb.Abb.entity.Transaction;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PdfService {

    public byte[] genererRelevePdf(Client client, List<Transaction> transactions) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);

        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("Relevé Bancaire - Al Barid Bank", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12);
            document.add(new Paragraph("Titulaire du compte : " + client.getName(), normalFont));
            document.add(new Paragraph("RIB : " + client.getRib(), normalFont));
            document.add(new Paragraph("Solde actuel : " + client.getSolde() + " MAD", normalFont));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10f);

            String[] headers = {"Date", "Description", "Type", "Montant (MAD)"};
            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cell);
            }

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

            for (Transaction t : transactions) {
                table.addCell(t.getTransactionDate().format(formatter));

                table.addCell(t.getDescription() != null ? t.getDescription() : "Virement");

                if (t.getSenderRib().equals(client.getRib())) {
                    table.addCell("Envoyé à: " + t.getReceiverRib());
                    table.addCell("-" + t.getAmount().toString());
                } else {
                    table.addCell("Reçu de: " + t.getSenderRib());
                    table.addCell("+" + t.getAmount().toString());
                }
            }

            document.add(table);
            document.close();

        } catch (DocumentException e) {
            throw new RuntimeException("Erreur lors de la génération du PDF", e);
        }

        return baos.toByteArray();
    }
}