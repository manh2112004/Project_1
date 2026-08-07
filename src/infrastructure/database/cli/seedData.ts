import { AppDataSource } from "../data-source";
import { CategoryOrmEntity } from "../entities/CategoryOrmEntity";
import { BrandOrmEntity } from "../entities/BrandOrmEntity";
import { ProductOrmEntity } from "../entities/ProductOrmEntity";
import { InventoryOrmEntity } from "../entities/InventoryOrmEntity";

const seedDatabase = async () => {
  try {
    console.log("\n==========================================");
    console.log("🚀 KHỞI CHẠY SEEDING (BRAND, CATEGORY, PRODUCT)");
    console.log("==========================================\n");

    await AppDataSource.initialize();
    console.log("✅ Kết nối Cơ sở dữ liệu thành công.\n");

    const categoryRepo = AppDataSource.getRepository(CategoryOrmEntity);
    const brandRepo = AppDataSource.getRepository(BrandOrmEntity);
    const productRepo = AppDataSource.getRepository(ProductOrmEntity);
    const inventoryRepo = AppDataSource.getRepository(InventoryOrmEntity);

    // ----------------------------------------------------
    // 1. SEED CATEGORIES (Danh mục cha - con)
    // ----------------------------------------------------
    console.log("🔄 1. Khởi tạo Danh mục (Categories)...");
    const parentCategoriesData = [
      { name: "Điện tử & Công nghệ", slug: "dien-tu-cong-nghe", description: "Các thiết bị công nghệ, điện tử, viễn thông và phụ kiện thông minh." },
      { name: "Thời trang & Phụ kiện", slug: "thoi-trang-phu-kien", description: "Quần áo, giày dép, túi xách và phụ kiện thời trang nam nữ." },
      { name: "Nhà cửa & Đời sống", slug: "nha-cua-doi-song", description: "Nội thất, đồ gia dụng, trang trí nhà cửa và không gian sống." },
    ];

    const categoryMap = new Map<string, CategoryOrmEntity>();

    // Tạo danh mục gốc (Cha)
    for (const pCat of parentCategoriesData) {
      let cat = await categoryRepo.findOne({ where: { slug: pCat.slug } });
      if (!cat) {
        cat = categoryRepo.create({ ...pCat, parentId: null, isActive: true });
        await categoryRepo.save(cat);
      }
      categoryMap.set(pCat.slug, cat);
    }

    // Tạo danh mục con
    const techParent = categoryMap.get("dien-tu-cong-nghe")!;
    const fashionParent = categoryMap.get("thoi-trang-phu-kien")!;

    const childCategoriesData = [
      { name: "Điện thoại di động", slug: "dien-thoai-di-dong", description: "Smartphone đời mới nhất", parentId: techParent.id },
      { name: "Máy tính & Laptop", slug: "may-tinh-laptop", description: "Laptop văn phòng, laptop gaming, PC", parentId: techParent.id },
      { name: "Thời trang Nam", slug: "thoi-trang-nam", description: "Áo sơ mi, quần âu, áo thun nam", parentId: fashionParent.id },
      { name: "Thời trang Nữ", slug: "thoi-trang-nu", description: "Váy đầm, áo kiểu thời trang nữ", parentId: fashionParent.id },
    ];

    for (const cCat of childCategoriesData) {
      let cat = await categoryRepo.findOne({ where: { slug: cCat.slug } });
      if (!cat) {
        cat = categoryRepo.create({ ...cCat, isActive: true });
        await categoryRepo.save(cat);
      }
      categoryMap.set(cCat.slug, cat);
    }

    // ----------------------------------------------------
    // 2. SEED BRANDS (Thương hiệu đối tác)
    // ----------------------------------------------------
    console.log("🔄 2. Khởi tạo Thương hiệu (Brands)...");
    const brandsData = [
      { name: "Apple", description: "Thương hiệu công nghệ hàng đầu thế giới từ Mỹ", logo: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=300" },
      { name: "Samsung", description: "Tập đoàn công nghệ điện tử đa quốc gia Hàn Quốc", logo: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300" },
      { name: "ASUS", description: "Thương hiệu máy tính & linh kiện gaming nổi tiếng", logo: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300" },
      { name: "Sony", description: "Thương hiệu thiết bị âm thanh & giải trí hàng đầu Nhật Bản", logo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300" },
      { name: "Nike", description: "Thương hiệu thời trang & giày thể thao số 1 thế giới", logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300" },
      { name: "Xiaomi", description: "Thương hiệu thiết bị thông minh & gia dụng hiện đại", logo: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300" },
    ];

    const brandMap = new Map<string, BrandOrmEntity>();
    for (const b of brandsData) {
      let brand = await brandRepo.findOne({ where: { name: b.name } });
      if (!brand) {
        brand = brandRepo.create({ ...b, isActive: true });
        await brandRepo.save(brand);
      }
      brandMap.set(b.name, brand);
    }

    // ----------------------------------------------------
    // 3. SEED PRODUCTS & INVENTORIES (Sản phẩm & Tồn kho)
    // ----------------------------------------------------
    console.log("🔄 3. Khởi tạo Sản phẩm (Products) & Tồn kho...");
    const phoneCat = categoryMap.get("dien-thoai-di-dong")!;
    const laptopCat = categoryMap.get("may-tinh-laptop")!;
    const fashionNamCat = categoryMap.get("thoi-trang-nam")!;
    const fashionNuCat = categoryMap.get("thoi-trang-nu")!;

    const appleBrand = brandMap.get("Apple")!;
    const samsungBrand = brandMap.get("Samsung")!;
    const asusBrand = brandMap.get("ASUS")!;
    const sonyBrand = brandMap.get("Sony")!;
    const nikeBrand = brandMap.get("Nike")!;
    const xiaomiBrand = brandMap.get("Xiaomi")!;

    const productsData = [
      {
        name: "iPhone 15 Pro Max 256GB Titan Tự Nhiên",
        slug: "iphone-15-pro-max-256gb-titan-tu-nhien",
        sku: "IP15PM-256-NAT",
        shortDescription: "Chip Apple A17 Pro mạnh mẽ, vỏ Titan chuẩn hàng không vũ trụ",
        description: "iPhone 15 Pro Max sở hữu thiết kế Titan bền bỉ, mỏng nhẹ hàng đầu. Hệ thống camera 48MP đẳng cấp với zoom quang học 5x.",
        thumbnail: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600",
        price: 34990000,
        discountPrice: 29990000,
        categoryId: phoneCat.id,
        brandId: appleBrand.id,
        quantity: 50,
        importPrice: 26000000,
      },
      {
        name: "Samsung Galaxy S24 Ultra 5G 12GB/256GB",
        slug: "samsung-galaxy-s24-ultra-5g",
        sku: "SS-S24U-256",
        shortDescription: "Tích hợp Galaxy AI thông minh, bút S-Pen chuyên nghiệp",
        description: "Điện thoại Samsung Galaxy S24 Ultra trang bị vi xử lý Snapdragon 8 Gen 3 for Galaxy, khung viền Titan sang trọng và màn hình 120Hz siêu nét.",
        thumbnail: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600",
        price: 33990000,
        discountPrice: 27990000,
        categoryId: phoneCat.id,
        brandId: samsungBrand.id,
        quantity: 40,
        importPrice: 24000000,
      },
      {
        name: "MacBook Pro 16 inch M3 Max (36GB RAM / 1TB SSD)",
        slug: "macbook-pro-16-inch-m3-max",
        sku: "MBP16-M3MAX-1TB",
        shortDescription: "Hiệu năng cực đỉnh cho nhà sáng tạo nội dung chuyên nghiệp",
        description: "MacBook Pro 16 inch với chip M3 Max mang đến sức mạnh đồ họa đỉnh cao, màn hình Liquid Retina XDR độ sáng 1600 nits, thời lượng pin đến 22 giờ.",
        thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600",
        price: 89990000,
        discountPrice: 84990000,
        categoryId: laptopCat.id,
        brandId: appleBrand.id,
        quantity: 15,
        importPrice: 75000000,
      },
      {
        name: "Laptop Gaming ASUS ROG Strix G16 RTX 4070",
        slug: "laptop-gaming-asus-rog-strix-g16",
        sku: "ASUS-ROG-G16-4070",
        shortDescription: "Màn hình 240Hz Nebula Display, Tản nhiệt 3 quạt độc quyền",
        description: "ASUS ROG Strix G16 chiến mượt mọi tựa game AAA với Intel Core i9 Gen 14th và card đồ họa NVIDIA GeForce RTX 4070.",
        thumbnail: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600",
        price: 45990000,
        discountPrice: 41990000,
        categoryId: laptopCat.id,
        brandId: asusBrand.id,
        quantity: 25,
        importPrice: 36000000,
      },
      {
        name: "Tai nghe Chống ồn Sony WH-1000XM5",
        slug: "tai-nghe-chong-on-sony-wh-1000xm5",
        sku: "SONY-WH1000XM5-BLK",
        shortDescription: "Công nghệ chống ồn hàng đầu thế giới với hai bộ xử lý",
        description: "Tai nghe Sony WH-1000XM5 mang lại chất lượng âm thanh Hi-Res tuyệt hảo, thời lượng pin 30 giờ và khả năng đàm thoại siêu rõ nét.",
        thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
        price: 8490000,
        discountPrice: 6990000,
        categoryId: techParent.id,
        brandId: sonyBrand.id,
        quantity: 60,
        importPrice: 5200000,
      },
      {
        name: "Áo Sơ Mi Nam Công Sở Premium Cotton 100%",
        slug: "ao-so-mi-nam-cong-so-premium",
        sku: "SM-NAM-COTTON-01",
        shortDescription: "Chất liệu Cotton chống nhăn, phom dáng Slim-fit hiện đại",
        description: "Áo sơ mi nam công sở cao cấp, thoáng mát, giữ phom cực tốt suốt cả ngày làm việc năng động.",
        thumbnail: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600",
        price: 650000,
        discountPrice: 450000,
        categoryId: fashionNamCat.id,
        brandId: nikeBrand.id,
        quantity: 120,
        importPrice: 250000,
      },
      {
        name: "Đầm Xòe Nữ Dự Tiệc Dáng Dài Thanh Lịch",
        slug: "dam-xoe-nu-du-tiec-dang-dai",
        sku: "DAM-NU-TIEC-02",
        shortDescription: "Thiết kế tôn dáng tôn da, chất vải Voan lụa cao cấp",
        description: "Đầm xòe nữ dự tiệc phong cách Pháp quý phái, phù hợp cho các buổi dạ tiệc và sự kiện sang trọng.",
        thumbnail: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600",
        price: 1200000,
        discountPrice: 890000,
        categoryId: fashionNuCat.id,
        brandId: nikeBrand.id,
        quantity: 80,
        importPrice: 500000,
      },
      {
        name: "Robot Hút Bụi Lau Nhà Xiaomi Vacuum X10",
        slug: "robot-hut-bui-xiaomi-vacuum-x10",
        sku: "XIAOMI-VAC-X10",
        shortDescription: "Lực hút 4000Pa mạnh mẽ, trạm sạc tự động rút bụi",
        description: "Xiaomi Vacuum X10 lập bản đồ LDS thông minh, diệt khuẩn hiệu quả mang lại không gian sống sạch sẽ rực rỡ.",
        thumbnail: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600",
        price: 10990000,
        discountPrice: 8990000,
        categoryId: techParent.id,
        brandId: xiaomiBrand.id,
        quantity: 35,
        importPrice: 6800000,
      },
    ];

    for (const p of productsData) {
      let product = await productRepo.findOne({ where: { sku: p.sku } });
      if (!product) {
        product = productRepo.create({
          name: p.name,
          slug: p.slug,
          sku: p.sku,
          shortDescription: p.shortDescription,
          description: p.description,
          thumbnail: p.thumbnail,
          price: p.price,
          discountPrice: p.discountPrice,
          categoryId: p.categoryId,
          brandId: p.brandId,
          status: "ACTIVE",
        });
        await productRepo.save(product);

        // Tạo bản ghi Tồn kho tương ứng
        const inventory = inventoryRepo.create({
          productId: product.id,
          quantity: p.quantity,
          importPrice: p.importPrice,
        });
        await inventoryRepo.save(inventory);
      }
    }

    console.log("\n==========================================");
    console.log("🎉 SEEDING HOÀN TẤT THÀNH CÔNG!");
    console.log(`📁 Danh mục:   ${parentCategoriesData.length + childCategoriesData.length} danh mục`);
    console.log(`🏢 Thương hiệu: ${brandsData.length} nhãn hàng`);
    console.log(`📦 Sản phẩm:   ${productsData.length} sản phẩm thực tế kèm tồn kho`);
    console.log("==========================================\n");
  } catch (error: any) {
    console.error("\n❌ Lỗi trong quá trình Seeding Database:", error.message || error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(0);
  }
};

seedDatabase();
