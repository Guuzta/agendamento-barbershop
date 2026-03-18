import bcrypt from "bcrypt";

class Password {
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }
}

const password = new Password();

export default password;
