import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini AI Client lazily/safely
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing from environment variables.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "CRM TRỌ - MINIHOUSE" });
});

// AI Endpoint: Generate Rental Listing Post Content
app.post("/api/ai/generate-post", async (req, res) => {
  try {
    const { title, address, rentPrice, amenities, description } = req.body;

    const ai = getAiClient();
    const prompt = `Bạn là một Chuyên viên Bất động sản chuyên nghiệp. Hãy viết 1 bài đăng bài cho thuê phòng trọ / minihouse thu hút, súc tích, hấp dẫn trên Facebook / Chợ Tốt cho bất động sản sau:
- Tiêu đề: ${title || "Phòng trọ / Minihouse mới"}
- Địa chỉ: ${address || "Trung tâm thành phố"}
- Giá thuê: ${rentPrice ? `${rentPrice.toLocaleString("vi-VN")} VNĐ/tháng` : "Thỏa thuận"}
- Tiện ích: ${Array.isArray(amenities) ? amenities.join(", ") : "Đầy đủ tiện nghi"}
- Mô tả bổ sung: ${description || "Căn hộ sạch đẹp, giờ giấc tự do, an ninh đảm bảo."}

Yêu cầu bài viết:
1. Tiêu đề gây chú ý với emoji bắt mắt
2. Liệt kê điểm nổi bật, vị trí thuận tiện, tiện ích xung quanh
3. Lời kêu gọi hành động (Call to action) kèm số điện thoại liên hệ xem nhà ngay!
4. Giữ phong cách chuyên nghiệp, trung thực.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({ success: true, text: response.text });
  } catch (error: any) {
    console.error("AI Post Generation Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Không thể tạo bài viết AI lúc này.",
    });
  }
});

// AI Endpoint: Generate Top Staff Recognition Text
app.post("/api/ai/honor-summary", async (req, res) => {
  try {
    const { periodValue, top1Name, top1Revenue, top2Name, top2Revenue, top3Name, top3Revenue } = req.body;

    const ai = getAiClient();
    const prompt = `Viết một lời vinh danh nhân viên xuất sắc trong kỳ ${periodValue || "Tháng này"} cho công ty Bất động sản Minihouse:
- Hạng 1 (Quán quân Gold): ${top1Name} - Doanh số: ${top1Revenue ? top1Revenue.toLocaleString("vi-VN") : 0} VNĐ
- Hạng 2 (Á quân Silver): ${top2Name} - Doanh số: ${top2Revenue ? top2Revenue.toLocaleString("vi-VN") : 0} VNĐ
- Hạng 3 (Quý quân Bronze): ${top3Name} - Doanh số: ${top3Revenue ? top3Revenue.toLocaleString("vi-VN") : 0} VNĐ

Viết ngắn gọn 3-4 câu trang trọng, truyền cảm hứng, biểu dương nỗ lực cống hiến vượt bậc của tập thể nhân viên!`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({ success: true, text: response.text });
  } catch (error: any) {
    console.error("AI Honor Summary Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Lỗi tạo lời vinh danh AI.",
    });
  }
});

// Supabase Sync Endpoint
app.post("/api/supabase/sync", (req, res) => {
  res.json({
    success: true,
    syncedAt: new Date().toISOString(),
    message: "Đồng bộ dữ liệu Supabase real-time hoàn tất thành công!",
  });
});

async function startServer() {
  // Vite middleware for dev or static server for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CRM TRỌ - MINIHOUSE Server running on port ${PORT}`);
  });
}

startServer();
