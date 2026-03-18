import bcrypt from "bcrypt";

class Password {
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }

  async compare(password: string, userPassword: string): Promise<boolean> {
    const isPasswordValid = await bcrypt.compare(password, userPassword);

    return isPasswordValid;
  }
}

const password = new Password();

export default password;
