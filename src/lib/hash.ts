import bcrypt from "bcrypt";

export async function hashPass(password: string) {
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

export async function checkPass(password:string,hash:string){
  return bcrypt.compare(password,hash)
}