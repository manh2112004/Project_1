import readline from "readline";
import { AppDataSource } from "../data-source";
import { RoleOrmEntity } from "../entities/RoleOrmEntity";
import { UserOrmEntity } from "../entities/UserOrmEntity";
import { BcryptPasswordService } from "../../services/BcryptPasswordService";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer.trim());
    });
  });
};

const createSuperAdminCLI = async (): Promise<void> => {
  try {
    console.log("\n==========================================");
    console.log("   🛠️  TẠO TÀI KHOẢN SUPER ADMIN MỚI (CLI)");
    console.log("==========================================\n");

    await AppDataSource.initialize();
    console.log(" Kết nối Cơ sở dữ liệu thành công.\n");

    const email = await askQuestion("👉 Nhập Email Admin: ");
    if (!email || !email.includes("@")) {
      console.error("❌ Email không hợp lệ!");
      process.exit(1);
    }

    const password = await askQuestion("👉 Nhập Mật khẩu: ");
    if (!password || password.length < 6) {
      console.error("❌ Mật khẩu phải có ít nhất 6 ký tự!");
      process.exit(1);
    }

    const fullName = await askQuestion("👉 Nhập Họ và Tên: ");
    if (!fullName) {
      console.error("❌ Họ và tên không được để trống!");
      process.exit(1);
    }

    const userRepo = AppDataSource.getRepository(UserOrmEntity);
    const roleRepo = AppDataSource.getRepository(RoleOrmEntity);
    const passwordService = new BcryptPasswordService();

    // 1. Kiểm tra Email đã tồn tại chưa
    const existingUser = await userRepo.findOne({ where: { email } });
    if (existingUser) {
      console.error(`❌ Lỗi: Email '${email}' đã được sử dụng bởi một tài khoản khác!`);
      process.exit(1);
    }

    // 2. Tìm hoặc Tạo vai trò SUPER_ADMIN
    let superAdminRole = await roleRepo.findOne({
      where: [{ code: "SUPER_ADMIN" }, { name: "Super Admin" }],
    });

    if (!superAdminRole) {
      superAdminRole = roleRepo.create({
        name: "Super Admin",
        code: "SUPER_ADMIN",
        description: "Vai trò quản trị viên tối cao",
      });
      await roleRepo.save(superAdminRole);
      console.log("  Đã tự động khởi tạo vai trò SUPER_ADMIN trong DB.");
    }

    // 3. Băm mật khẩu và tạo User
    const passwordHash = await passwordService.hash(password);
    const newAdmin = userRepo.create({
      email,
      passwordHash,
      fullName,
      roleId: superAdminRole.id,
      gender: "OTHER",
      status: "ACTIVE",
    });

    await userRepo.save(newAdmin);

    console.log("\n==========================================");
    console.log("🎉 TẠO TÀI KHOẢN SUPER ADMIN THÀNH CÔNG!");
    console.log(`📧 Email:    ${email}`);
    console.log(`👤 Họ tên:   ${fullName}`);
    console.log(`🛡️  Vai trò:  ${superAdminRole.name} (${superAdminRole.code})`);
    console.log("==========================================\n");
  } catch (error: any) {
    console.error("\n❌ Lỗi trong quá trình tạo tài khoản:", error.message || error);
  } finally {
    rl.close();
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(0);
  }
};

createSuperAdminCLI();
