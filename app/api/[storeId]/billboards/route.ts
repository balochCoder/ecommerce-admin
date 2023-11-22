import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { label, imageUrl } = body;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!label) {
      return new NextResponse("Label is required", { status: 422 });
    }
    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 422 });
    }
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 422 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("BILLBOARDS_POST", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}


export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 422 });
    }

   

    const sizes = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.log("BILLBOARDS_GET", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}