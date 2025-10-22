import express from "express";
import dotenv from "dotenv";
import { google } from "googleapis";

dotenv.config();
const app = express();

app.get("/api/grupo", async (req, res) => {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.SHEET_ID;
    const range = "Página1!B:C"; 

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values || [];
    const grupoDisponivel = rows.find(
      (r) => (r[1] || "").toLowerCase() === "vazio"
    );

    if (grupoDisponivel) {
      const link = grupoDisponivel[0];
      return res.redirect(link);
    }

    res.status(200).send("🚫 Todos os grupos estão cheios no momento.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar grupo.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));
