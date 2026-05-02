import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync";
import { ApiError } from "../utils/apiError";
import prisma from "../lib/prisma";

const secretKey = process.env.secret_key as string;
const refreshkey = process.env.refresh_key as string;

export const handleUpdateProfile = catchAsync(
  async (req: Request, res: Response): Promise<any> => {
    const userId = req.params.id as string;
    const { firstName, lastName, state, city } = req.body;
    const data = { firstName, lastName, state, city };

    const updatedProfile = await prisma.user.update({
      where: { id: userId },
      data: data,
      select: {
        firstName: true,
        lastName: true,
        state: true,
        city: true,
        email: true,
        role: true,
        id: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!updatedProfile) throw new ApiError(404, "User not found");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedProfile,
    });
  }
);

export const handleSignup = catchAsync(
  async (req: Request, res: Response): Promise<any> => {
    const { email, password, firstName, lastName } = req.body;
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) throw new ApiError(400, `User with email ${email} exists`);
    const hashedPassword = await bcrypt.hash(password, 10);
    const userSaved = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    if (!userSaved) throw new ApiError(400, "Error adding new user");
    const accessToken = jwt.sign(
      { id: userSaved.id, role: userSaved.role },
      secretKey,
      { expiresIn: "2h" }
    );
    const refreshToken = jwt.sign(
      { id: userSaved.id, role: userSaved.role },
      refreshkey,
      { expiresIn: "7d" }
    );
    await prisma.user.update({
      where: { email },
      data: {
        refreshToken,
      },
    });
    return res.status(200).json({
      message: " New user registered successfully",
      userId: userSaved.id,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }
);

export const handleLogin = catchAsync(
  async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    const userFound = await prisma.user.findUnique({
      where: { email },
    });
    if (!userFound)
      throw new ApiError(400, `User with email ${email} is not found`);

    const passwordMatch = await bcrypt.compare(password, userFound.password);
    if (!passwordMatch) throw new ApiError(400, "Invalid password");
    const accessToken = jwt.sign(
      { id: userFound.id, role: userFound.role },
      secretKey,
      { expiresIn: "2h" }
    );
    const refreshToken = jwt.sign(
      { id: userFound.id, role: userFound.role },
      refreshkey,
      { expiresIn: "7d" }
    );
    await prisma.user.update({
      where: { email },
      data: {
        refreshToken,
      },
    });

    res.status(200).json({
      message: "login successful",
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }
);

export const getUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id as string;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      city: true,
      state: true,
    },
  });

  if (!user) throw new ApiError(404, "User not found");
  res.status(200).json({ user });
});

export const getUserCartItems = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.params.id as string;
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId,
      },
      include: {
        book: true,
      },
    });

    if (cartItems.length === 0) throw new ApiError(404, "No item in cart");
    res.status(200).json({ cartItems });
  }
);

export const getWishlistBooks = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const wishlistBooks = await prisma.wishlist.findMany({
    where: {
      userId
    },
    include: {
      book: true
    }
  });
  
  if(!wishlistBooks){
    res.status(400).json({message: "No books in wishlist"});
  }
  
  res.status(200).json({wishlistBooks});
})