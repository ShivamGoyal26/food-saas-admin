import z from "zod";

export const LoginSchema = z.object({
  username: z.string().superRefine((val, ctx) => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    const isPhone = /^[6-9]\d{9}$/.test(val);

    if (!isEmail && !isPhone) {
      ctx.addIssue({
        code: "custom",
        message: "Username must be a valid email or phone number",
      });
    }
  }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
