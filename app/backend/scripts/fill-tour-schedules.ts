import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Tour from "../models/tour.model";

/**
 * One-off backfill: drafts day-by-day itinerary content for tours that only
 * have an empty placeholder schedule. Content below is AI-drafted based on
 * the tour name/destination only — review and adjust wording, hotel/meal
 * details, etc. against the real itinerary before publishing.
 */

const dayTitles = ["Ngày thứ nhất", "Ngày thứ hai", "Ngày thứ ba", "Ngày thứ tư", "Ngày thứ năm"];

interface TourUpdate {
  id: string;
  time?: string;
  days: string[]; // description HTML per day
}

const updates: TourUpdate[] = [
  {
    id: "6981f2dc31bcfde2e64e2b85", // Hà Nội – Lào Cai – SaPa 4N3Đ
    time: "4 ngày 3 đêm",
    days: [
      "<p>Xe và hướng dẫn viên đón khách tại Hà Nội, khởi hành đi Lào Cai. Đoàn dừng chân nghỉ ngơi dọc đường, ăn tối tại nhà hàng địa phương trước khi lên xe giường nằm/tàu hỏa đêm đến Lào Cai.</p>",
      "<p>Đến Lào Cai, xe đưa đoàn lên thị trấn Sa Pa. Buổi sáng tham quan bản Cát Cát, chiêm ngưỡng thác nước và tìm hiểu văn hóa người H'Mông. Chiều dạo quanh trung tâm Sa Pa, nhà thờ đá, chợ tình Sa Pa. Ăn tối và nghỉ đêm tại Sa Pa.</p>",
      "<p>Đoàn di chuyển bằng cáp treo Fansipan lên đỉnh núi cao nhất Đông Dương, chinh phục 'Nóc nhà Đông Dương'. Chiều tham quan bản Tả Phìn, tìm hiểu nghề dệt thổ cẩm truyền thống. Tối tự do khám phá thị trấn Sa Pa về đêm.</p>",
      "<p>Sáng tự do dạo chợ, mua đặc sản Sa Pa làm quà. Đoàn trả phòng, xe đưa khách về lại Lào Cai và di chuyển về Hà Nội, kết thúc chương trình tour, chia tay và hẹn gặp lại quý khách.</p>",
    ],
  },
  {
    id: "6981f3ed31bcfde2e64e2bd3", // Phú Quốc 3N2D
    days: [
      "<p>Đón khách tại sân bay Phú Quốc, xe đưa đoàn về khách sạn nhận phòng nghỉ ngơi. Chiều tham quan chợ đêm Dinh Cậu, thưởng thức hải sản tươi sống và khám phá ẩm thực đường phố Phú Quốc.</p>",
      "<p>Cả ngày tham gia tour khám phá 4 đảo: lặn ngắm san hô, câu cá, tắm biển tại Hòn Móng Tay, Hòn Gầm Ghì. Buổi tối tự do dạo biển hoặc trải nghiệm phố đi bộ.</p>",
      "<p>Sáng tham quan Vinpearl Safari hoặc trải nghiệm cáp treo Hòn Thơm - cáp treo vượt biển dài nhất thế giới. Chiều tự do mua sắm đặc sản (nước mắm, hồ tiêu, ngọc trai), xe đưa đoàn ra sân bay kết thúc chương trình.</p>",
    ],
  },
  {
    id: "6981f48931bcfde2e64e2c28", // Đà Nẵng – Hội An – Bà Nà
    days: [
      "<p>Đón khách tại sân bay/ga Đà Nẵng, xe đưa đoàn về khách sạn nhận phòng. Tham quan Cầu Rồng, cầu Tình Yêu, dạo biển Mỹ Khê. Tối thưởng thức đặc sản Đà Nẵng.</p>",
      "<p>Khởi hành đi Bà Nà Hills, trải nghiệm cáp treo đạt kỷ lục Guinness, tham quan Cầu Vàng, Làng Pháp, khu vui chơi Fantasy Park. Chiều về lại thành phố nghỉ ngơi.</p>",
      "<p>Tham quan phố cổ Hội An: Chùa Cầu, nhà cổ Tấn Ký, dạo chợ Hội An, thả đèn hoa đăng trên sông Hoài. Trên đường về ghé Ngũ Hành Sơn (Marble Mountains). Kết thúc chương trình, xe đưa đoàn ra sân bay/ga.</p>",
    ],
  },
  {
    id: "69821206ad96be42fcbd3eb8", // Du lịch Bắc Ninh
    days: [
      "<p>Xe đón khách tại điểm hẹn, khởi hành đi Bắc Ninh. Tham quan đền Đô - nơi thờ 8 vị vua nhà Lý, tìm hiểu lịch sử vùng đất Kinh Bắc. Ăn trưa tại nhà hàng địa phương.</p>",
      "<p>Tham quan chùa Dâu, chùa Phật Tích, thưởng thức làn điệu quan họ Bắc Ninh cùng các liền anh liền chị. Chiều ghé làng tranh Đông Hồ tìm hiểu nghề làm tranh dân gian truyền thống.</p>",
      "<p>Tham quan làng gốm Phù Lãng, mua sắm đặc sản Bắc Ninh (bánh phu thê, nem Bùi...). Xe đưa đoàn về lại điểm xuất phát, kết thúc chương trình tour.</p>",
    ],
  },
  {
    id: "6982124fad96be42fcbd3efa", // Du lịch Thái Nguyên
    days: [
      "<p>Xe đón khách khởi hành đi Thái Nguyên. Tham quan khu di tích ATK Định Hóa - thủ đô kháng chiến, tìm hiểu lịch sử cách mạng Việt Nam. Ăn trưa tại nhà hàng địa phương.</p>",
      "<p>Tham quan các đồi chè Tân Cương nổi tiếng, tìm hiểu quy trình chế biến trà và thưởng thức trà Thái Nguyên chính gốc. Chiều tham quan Hồ Núi Cốc, dạo thuyền ngắm cảnh.</p>",
      "<p>Tham quan khu du lịch sinh thái, mua sắm đặc sản chè Thái Nguyên làm quà. Xe đưa đoàn về lại điểm xuất phát, kết thúc chương trình.</p>",
    ],
  },
  {
    id: "69821290ad96be42fcbd3f39", // Vịnh Hạ Long
    days: [
      "<p>Xe đón khách tại điểm hẹn khởi hành đi Hạ Long. Lên du thuyền, làm thủ tục nhận phòng. Thưởng thức bữa trưa hải sản trên du thuyền trong khi ngắm cảnh vịnh. Tham quan hang Sửng Sốt.</p>",
      "<p>Chèo thuyền kayak khám phá vịnh, tắm biển tại đảo Ti Tốp, leo núi ngắm toàn cảnh vịnh Hạ Long từ trên cao. Tối thưởng thức tiệc hải sản trên du thuyền, ngắm hoàng hôn trên biển.</p>",
      "<p>Sáng sớm tham gia lớp tập Thái Cực Quyền trên boong tàu, ăn sáng, tham quan làng chài truyền thống hoặc động Thiên Cung. Làm thủ tục trả phòng, xe đưa đoàn về lại điểm xuất phát.</p>",
    ],
  },
  {
    id: "698212e0ad96be42fcbd3f83", // Nha Trang
    days: [
      "<p>Đón khách tại sân bay Cam Ranh/ga Nha Trang, xe đưa về khách sạn nhận phòng. Chiều dạo biển Trần Phú, tham quan chợ Đầm. Tối tự do khám phá ẩm thực đường phố Nha Trang.</p>",
      "<p>Tham gia tour 4 đảo: lặn ngắm san hô, tắm bùn khoáng nóng, tham quan Hòn Mun, Hòn Tằm. Buổi trưa thưởng thức hải sản tươi sống ngay trên đảo.</p>",
      "<p>Tham quan Vinpearl Land, trải nghiệm cáp treo vượt biển dài nhất Việt Nam, vui chơi tại công viên nước và khu vui chơi giải trí. Chiều tham quan Tháp Bà Ponagar, xe đưa đoàn ra sân bay kết thúc chương trình.</p>",
    ],
  },
  {
    id: "6982145e17327d687cffaa36", // Nhật Bản
    days: [
      "<p>Đoàn khởi hành từ Việt Nam, đến Tokyo. Xe đón đoàn về khách sạn nhận phòng nghỉ ngơi. Tối tham quan khu phố Shinjuku, chiêm ngưỡng ánh đèn neon rực rỡ của Tokyo về đêm.</p>",
      "<p>Tham quan chùa Asakusa Kannon, phố mua sắm Nakamise, ngắm tháp Tokyo Skytree. Chiều di chuyển ngắm núi Phú Sĩ (Fuji) từ hồ Kawaguchi (tùy thời tiết), trải nghiệm onsen truyền thống Nhật Bản.</p>",
      "<p>Di chuyển đến Osaka bằng tàu cao tốc Shinkansen, tham quan lâu đài Osaka, khu phố Dotonbori sầm uất. Chiều tự do mua sắm đặc sản Nhật Bản, xe đưa đoàn ra sân bay về Việt Nam, kết thúc chương trình.</p>",
    ],
  },
  {
    id: "698214d217327d687cffaab6", // Nga
    days: [
      "<p>Đoàn khởi hành từ Việt Nam đến Moscow. Xe đón đoàn về khách sạn nhận phòng nghỉ ngơi sau chuyến bay dài.</p>",
      "<p>Tham quan Quảng trường Đỏ, Điện Kremlin, nhà thờ Thánh Basil biểu tượng của nước Nga. Chiều tham quan phố đi bộ Arbat, tìm hiểu văn hóa và lịch sử nước Nga.</p>",
      "<p>Tham quan ga tàu điện ngầm Moscow nổi tiếng với kiến trúc nghệ thuật độc đáo, dạo công viên Gorky. Chiều tự do mua sắm quà lưu niệm, xe đưa đoàn ra sân bay về Việt Nam.</p>",
    ],
  },
  {
    id: "698214fa17327d687cffaae2", // Trung Quốc
    days: [
      "<p>Đoàn khởi hành từ Việt Nam, làm thủ tục nhập cảnh Trung Quốc. Xe đưa đoàn về khách sạn nhận phòng nghỉ ngơi.</p>",
      "<p>Tham quan Vạn Lý Trường Thành - một trong bảy kỳ quan thế giới, Tử Cấm Thành với kiến trúc cung đình cổ kính. Chiều tham quan Quảng trường Thiên An Môn.</p>",
      "<p>Tham quan Di Hòa Viên - khu vườn hoàng gia nổi tiếng, tự do mua sắm đặc sản. Xe đưa đoàn làm thủ tục xuất cảnh, về lại Việt Nam kết thúc chương trình.</p>",
    ],
  },
  {
    id: "6982153717327d687cffab60", // Thái Lan
    days: [
      "<p>Đoàn khởi hành từ Việt Nam đến Bangkok. Xe đón đoàn về khách sạn nhận phòng. Chiều tham quan chợ đêm, thưởng thức ẩm thực đường phố Thái Lan.</p>",
      "<p>Tham quan Cung điện Hoàng gia, Chùa Phật Ngọc, Chùa Bình Minh (Wat Arun) bên dòng sông Chao Phraya. Chiều tự do mua sắm tại trung tâm thương mại sầm uất Bangkok.</p>",
      "<p>Di chuyển đến Pattaya, tham quan chợ nổi 4 miền, thưởng thức show Alcazar nổi tiếng. Xe đưa đoàn ra sân bay về Việt Nam, kết thúc chương trình tour.</p>",
    ],
  },
];

async function run() {
  await mongoose.connect(process.env.DATABASE as string);
  console.log("MongoDB connected");

  let updated = 0;
  let failed = 0;

  for (const u of updates) {
    try {
      const tour = await Tour.findById(u.id);
      if (!tour) {
        console.error(`Tour not found: ${u.id}`);
        failed++;
        continue;
      }
      if (u.time) tour.time = u.time;
      tour.schedules = u.days.map((description, i) => ({
        title: dayTitles[i] ?? `Ngày thứ ${i + 1}`,
        description,
      }));
      await tour.save();
      console.log(`Updated "${tour.name}" (${u.days.length} days)`);
      updated++;
    } catch (err: any) {
      failed++;
      console.error(`Failed to update tour ${u.id}:`, err?.message || err);
    }
  }

  console.log("---");
  console.log(`Tours updated: ${updated}`);
  console.log(`Failures: ${failed}`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
