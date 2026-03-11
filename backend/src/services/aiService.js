import axios from "axios";
import { createHttpError } from "../utils/httpError.js";

const buildDatasetPreview = (rows) => {
  const limitedRows = rows.slice(0, 25);
  return JSON.stringify(limitedRows, null, 2);
};

const buildPrompt = (rows) => `
Analyze this sales dataset and generate a concise executive summary.
Include:
- total revenue trends
- best performing region
- best product category
- anomalies
- strategic recommendations

Return a business-friendly summary with clear section headings.

Dataset sample:
${buildDatasetPreview(rows)}
`;

const normalizeKey = (value) => String(value || "").trim().toLowerCase();

const findKey = (row, candidates) => {
  const keys = Object.keys(row || {});
  return keys.find((key) => candidates.includes(normalizeKey(key)));
};

const getNumericValue = (row, candidates) => {
  const key = findKey(row, candidates);

  if (!key) {
    return 0;
  }

  const value = Number.parseFloat(String(row[key]).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(value) ? value : 0;
};

const getStringValue = (row, candidates) => {
  const key = findKey(row, candidates);
  return key ? String(row[key] || "").trim() : "";
};

const buildFallbackSummary = (rows) => {
  const totalRows = rows.length;
  const totalRevenue = rows.reduce(
    (sum, row) => sum + getNumericValue(row, ["revenue", "sales", "amount", "total", "total revenue"]),
    0
  );
  const totalUnits = rows.reduce(
    (sum, row) => sum + getNumericValue(row, ["units", "units sold", "quantity", "qty"]),
    0
  );
  const groupedRevenue = rows.reduce(
    (accumulator, row) => {
      const region = getStringValue(row, ["region", "sales region", "market"]) || "Unspecified region";
      const category =
        getStringValue(row, ["product category", "category", "product", "segment"]) || "Unspecified category";
      const revenue = getNumericValue(row, ["revenue", "sales", "amount", "total", "total revenue"]);

      accumulator.regions.set(region, (accumulator.regions.get(region) || 0) + revenue);
      accumulator.categories.set(category, (accumulator.categories.get(category) || 0) + revenue);

      return accumulator;
    },
    {
      regions: new Map(),
      categories: new Map()
    }
  );

  const topRegion =
    [...groupedRevenue.regions.entries()].sort((left, right) => right[1] - left[1])[0] || ["No region data", 0];
  const topCategory =
    [...groupedRevenue.categories.entries()].sort((left, right) => right[1] - left[1])[0] || ["No category data", 0];
  const averageRevenuePerRow = totalRows ? totalRevenue / totalRows : 0;
  const highValueRows = rows.filter(
    (row) => getNumericValue(row, ["revenue", "sales", "amount", "total", "total revenue"]) > averageRevenuePerRow * 2
  ).length;

  return [
    "Executive Summary",
    "",
    `Records analyzed: ${totalRows}`,
    `Estimated total revenue: ${totalRevenue.toFixed(2)}`,
    totalUnits ? `Estimated units sold: ${totalUnits.toFixed(0)}` : "Estimated units sold: not available in dataset",
    "",
    "Performance Highlights",
    `Top region: ${topRegion[0]} (${topRegion[1].toFixed(2)})`,
    `Top product category: ${topCategory[0]} (${topCategory[1].toFixed(2)})`,
    "",
    "Anomalies",
    highValueRows
      ? `${highValueRows} records are significantly above the average revenue per row and should be reviewed.`
      : "No obvious outlier rows were detected from the sampled numeric fields.",
    "",
    "Recommendations",
    `Prioritize follow-up on ${topRegion[0]} and ${topCategory[0]} because they lead this dataset.`,
    "Validate unusually high-value transactions and confirm whether they reflect enterprise deals, seasonality, or data quality issues."
  ].join("\n");
};

const hasAiConfig = () => {
  const { AI_API_KEY, AI_API_URL } = process.env;
  return Boolean(AI_API_KEY && AI_API_URL && !AI_API_KEY.includes("your_") && !AI_API_KEY.includes("your-"));
};

const callOpenAICompatible = async (prompt) => {
  const response = await axios.post(
    process.env.AI_API_URL,
    {
      model: process.env.AI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an executive sales analyst."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.AI_API_KEY}`,
        "Content-Type": "application/json"
      },
      timeout: 30000
    }
  );

  return response.data?.choices?.[0]?.message?.content?.trim();
};

const callGemini = async (prompt) => {
  const response = await axios.post(
    `${process.env.AI_API_URL}?key=${process.env.AI_API_KEY}`,
    {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.3
      }
    },
    {
      headers: {
        "Content-Type": "application/json"
      },
      timeout: 30000
    }
  );

  return response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
};

export const generateSalesSummary = async (rows) => {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw createHttpError(400, "Uploaded file does not contain any sales records");
  }

  if (!hasAiConfig()) {
    return buildFallbackSummary(rows);
  }

  const prompt = buildPrompt(rows);
  const provider = process.env.AI_PROVIDER || "gemini";

  let summary;

  try {
    if (provider === "openai-compatible") {
      summary = await callOpenAICompatible(prompt);
    } else {
      summary = await callGemini(prompt);
    }
  } catch (error) {
    if (error.response?.status || error.code) {
      return buildFallbackSummary(rows);
    }

    throw error;
  }

  if (!summary) {
    return buildFallbackSummary(rows);
  }

  return summary;
};
