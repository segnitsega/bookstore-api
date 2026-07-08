import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Open Library large cover by cover id — only include books with a real cover. */
const cover = (id: number) =>
  `https://covers.openlibrary.org/b/id/${id}-L.jpg`;

type SeedBook = {
  title: string;
  author: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
  featured: boolean;
  bestSellers: boolean;
  bookRating: number;
  genre: string;
  reviews: number;
  pages: number;
  publisher: string;
  publishedDate: string;
  isbn: string;
};

const books: SeedBook[] = [
  // -------------------- Science (6) --------------------
  {
    title: "Astrophysics for People in a Hurry",
    author: "Neil deGrasse Tyson",
    price: 24.99,
    stock: 18,
    description:
      "A clear, witty tour of the cosmos—from the Big Bang to black holes—for curious minds short on time.",
    imageUrl: cover(7984709),
    featured: true,
    bestSellers: true,
    bookRating: 4.2,
    genre: "science",
    reviews: 410,
    pages: 224,
    publisher: "W. W. Norton & Company",
    publishedDate: "2017-05-02",
    isbn: "9780393609394",
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    price: 18.99,
    stock: 22,
    description:
      "Hawking’s landmark guide to the universe: space, time, black holes, and the search for a theory of everything.",
    imageUrl: cover(10432365),
    featured: true,
    bestSellers: true,
    bookRating: 4.5,
    genre: "science",
    reviews: 5200,
    pages: 256,
    publisher: "Bantam",
    publishedDate: "1998-09-01",
    isbn: "9780553380163",
  },
  {
    title: "The Gene: An Intimate History",
    author: "Siddhartha Mukherjee",
    price: 28.0,
    stock: 14,
    description:
      "A sweeping, human story of heredity—from Mendel’s garden to CRISPR—told with scientific and moral clarity.",
    imageUrl: cover(11320163),
    featured: true,
    bestSellers: false,
    bookRating: 4.6,
    genre: "science",
    reviews: 1800,
    pages: 608,
    publisher: "Scribner",
    publishedDate: "2016-05-17",
    isbn: "9781476733500",
  },
  {
    title: "The Immortal Life of Henrietta Lacks",
    author: "Rebecca Skloot",
    price: 16.99,
    stock: 20,
    description:
      "The true story of Henrietta Lacks, whose cells transformed medicine—and the family left in the dark.",
    imageUrl: cover(8364866),
    featured: false,
    bestSellers: true,
    bookRating: 4.4,
    genre: "science",
    reviews: 3400,
    pages: 381,
    publisher: "Crown",
    publishedDate: "2010-02-02",
    isbn: "9781400052189",
  },
  {
    title: "The Sixth Extinction",
    author: "Elizabeth Kolbert",
    price: 17.5,
    stock: 16,
    description:
      "A Pulitzer Prize–winning look at how humans are driving a mass extinction unlike any in Earth’s history.",
    imageUrl: cover(7910870),
    featured: false,
    bestSellers: true,
    bookRating: 4.3,
    genre: "science",
    reviews: 2100,
    pages: 336,
    publisher: "Henry Holt and Co.",
    publishedDate: "2014-02-11",
    isbn: "9780805092998",
  },
  {
    title: "Cosmos",
    author: "Carl Sagan",
    price: 19.99,
    stock: 15,
    description:
      "Sagan’s luminous journey through the universe—science, wonder, and our place among the stars.",
    imageUrl: cover(8283901),
    featured: true,
    bestSellers: false,
    bookRating: 4.7,
    genre: "science",
    reviews: 4800,
    pages: 384,
    publisher: "Ballantine Books",
    publishedDate: "1985-05-12",
    isbn: "9780345539434",
  },

  // -------------------- History (6) --------------------
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    price: 29.99,
    stock: 24,
    description:
      "How Homo sapiens conquered the world—through cognitive, agricultural, and scientific revolutions.",
    imageUrl: cover(8634250),
    featured: true,
    bestSellers: true,
    bookRating: 4.6,
    genre: "history",
    reviews: 12400,
    pages: 498,
    publisher: "Harper",
    publishedDate: "2015-02-10",
    isbn: "9780062316097",
  },
  {
    title: "Guns, Germs, and Steel",
    author: "Jared Diamond",
    price: 26.5,
    stock: 12,
    description:
      "A bold answer to why societies developed so differently across continents over the last 13,000 years.",
    imageUrl: cover(7884018),
    featured: false,
    bestSellers: true,
    bookRating: 4.3,
    genre: "history",
    reviews: 7800,
    pages: 528,
    publisher: "W. W. Norton & Company",
    publishedDate: "1999-04-01",
    isbn: "9780393317558",
  },
  {
    title: "The Silk Roads",
    author: "Peter Frankopan",
    price: 27.0,
    stock: 11,
    description:
      "A vivid new history of the world told through the trade routes that connected East and West.",
    imageUrl: cover(8963642),
    featured: true,
    bestSellers: false,
    bookRating: 4.2,
    genre: "history",
    reviews: 1900,
    pages: 656,
    publisher: "Vintage",
    publishedDate: "2017-03-07",
    isbn: "9781101946329",
  },
  {
    title: "Team of Rivals",
    author: "Doris Kearns Goodwin",
    price: 32.0,
    stock: 9,
    description:
      "Lincoln’s political genius—and how he forged a cabinet of former rivals into a force for union.",
    imageUrl: cover(9286949),
    featured: true,
    bestSellers: false,
    bookRating: 4.5,
    genre: "history",
    reviews: 3200,
    pages: 944,
    publisher: "Simon & Schuster",
    publishedDate: "2005-10-25",
    isbn: "9780743270755",
  },
  {
    title: "The Wright Brothers",
    author: "David McCullough",
    price: 21.0,
    stock: 13,
    description:
      "The remarkable story of Wilbur and Orville Wright and the birth of powered flight.",
    imageUrl: cover(7317364),
    featured: false,
    bestSellers: true,
    bookRating: 4.1,
    genre: "history",
    reviews: 2900,
    pages: 336,
    publisher: "Simon & Schuster",
    publishedDate: "2015-05-05",
    isbn: "9781476728759",
  },
  {
    title: "Educated",
    author: "Tara Westover",
    price: 18.99,
    stock: 19,
    description:
      "A powerful memoir of growing up isolated from formal education—and claiming knowledge as freedom.",
    imageUrl: cover(8314077),
    featured: true,
    bestSellers: true,
    bookRating: 4.7,
    genre: "history",
    reviews: 8900,
    pages: 352,
    publisher: "Random House",
    publishedDate: "2018-02-20",
    isbn: "9780399590504",
  },

  // -------------------- Programming (5) --------------------
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    price: 49.99,
    stock: 16,
    description:
      "A handbook of agile software craftsmanship—how to write code that is clear, maintainable, and kind to readers.",
    imageUrl: cover(8065615),
    featured: true,
    bestSellers: true,
    bookRating: 4.6,
    genre: "programming",
    reviews: 4200,
    pages: 464,
    publisher: "Prentice Hall",
    publishedDate: "2008-08-01",
    isbn: "9780132350884",
  },
  {
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    price: 59.99,
    stock: 14,
    description:
      "The definitive guide to reliable, scalable, and maintainable data systems—from storage to distributed design.",
    imageUrl: cover(8434671),
    featured: true,
    bestSellers: true,
    bookRating: 4.8,
    genre: "programming",
    reviews: 3100,
    pages: 616,
    publisher: "O'Reilly Media",
    publishedDate: "2017-03-16",
    isbn: "9781449373320",
  },
  {
    title: "Effective Java",
    author: "Joshua Bloch",
    price: 54.0,
    stock: 10,
    description:
      "Best practices for the Java platform—concise, actionable items every serious Java developer should know.",
    imageUrl: cover(1176573),
    featured: true,
    bestSellers: false,
    bookRating: 4.6,
    genre: "programming",
    reviews: 1800,
    pages: 416,
    publisher: "Addison-Wesley",
    publishedDate: "2018-01-06",
    isbn: "9780134685991",
  },
  {
    title: "Refactoring",
    author: "Martin Fowler",
    price: 54.0,
    stock: 11,
    description:
      "Improving the design of existing code—with clear techniques, examples, and a catalog of refactorings.",
    imageUrl: cover(7087623),
    featured: false,
    bestSellers: true,
    bookRating: 4.4,
    genre: "programming",
    reviews: 1500,
    pages: 448,
    publisher: "Addison-Wesley",
    publishedDate: "2018-11-19",
    isbn: "9780134757599",
  },
  {
    title: "Design Patterns",
    author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    price: 59.0,
    stock: 9,
    description:
      "The classic “Gang of Four” catalog of reusable object-oriented design patterns.",
    imageUrl: cover(6601119),
    featured: false,
    bestSellers: true,
    bookRating: 4.3,
    genre: "programming",
    reviews: 2600,
    pages: 395,
    publisher: "Addison-Wesley",
    publishedDate: "1994-10-21",
    isbn: "9780201633610",
  },

  // -------------------- Religion (5) --------------------
  {
    title: "Mere Christianity",
    author: "C. S. Lewis",
    price: 16.0,
    stock: 20,
    description:
      "Lewis’s clear, timeless case for Christian faith—reason, morality, and the heart of belief.",
    imageUrl: cover(6538891),
    featured: true,
    bestSellers: true,
    bookRating: 4.6,
    genre: "religion",
    reviews: 8500,
    pages: 256,
    publisher: "HarperOne",
    publishedDate: "2001-02-06",
    isbn: "9780060652920",
  },
  {
    title: "The Power of Now",
    author: "Eckhart Tolle",
    price: 17.99,
    stock: 22,
    description:
      "A guide to spiritual presence—quieting the mind and living fully in the present moment.",
    imageUrl: cover(551262),
    featured: true,
    bestSellers: true,
    bookRating: 4.3,
    genre: "religion",
    reviews: 11200,
    pages: 236,
    publisher: "New World Library",
    publishedDate: "2004-08-19",
    isbn: "9781577314806",
  },
  {
    title: "The Case for Christ",
    author: "Lee Strobel",
    price: 18.99,
    stock: 18,
    description:
      "A journalist’s investigation into the historical evidence for Jesus and the Christian faith.",
    imageUrl: cover(2261045),
    featured: false,
    bestSellers: true,
    bookRating: 4.4,
    genre: "religion",
    reviews: 6200,
    pages: 336,
    publisher: "Zondervan",
    publishedDate: "1998-09-01",
    isbn: "9780310209307",
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 16.5,
    stock: 26,
    description:
      "A fable about following your dreams—treasure, destiny, and listening to the heart’s quiet voice.",
    imageUrl: cover(7414780),
    featured: true,
    bestSellers: true,
    bookRating: 4.5,
    genre: "religion",
    reviews: 14500,
    pages: 208,
    publisher: "HarperOne",
    publishedDate: "1993-01-01",
    isbn: "9780061122415",
  },
  {
    title: "Autobiography of a Yogi",
    author: "Paramahansa Yogananda",
    price: 14.99,
    stock: 17,
    description:
      "A spiritual classic introducing yoga, meditation, and the search for self-realization.",
    imageUrl: cover(805448),
    featured: false,
    bestSellers: false,
    bookRating: 4.5,
    genre: "religion",
    reviews: 4100,
    pages: 516,
    publisher: "Self-Realization Fellowship",
    publishedDate: "1946-01-01",
    isbn: "9780876120798",
  },

  // -------------------- Fiction (6) --------------------
  {
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 18.5,
    stock: 25,
    description:
      "Between life and death lies a library of infinite lives—one woman’s chance to try them all.",
    imageUrl: cover(10313767),
    featured: true,
    bestSellers: true,
    bookRating: 4.2,
    genre: "fiction",
    reviews: 9800,
    pages: 304,
    publisher: "Viking",
    publishedDate: "2020-09-29",
    isbn: "9780525559474",
  },
  {
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    price: 17.0,
    stock: 21,
    description:
      "A haunting story of friendship, guilt, and redemption set against the backdrop of Afghanistan.",
    imageUrl: cover(14846827),
    featured: false,
    bestSellers: true,
    bookRating: 4.6,
    genre: "fiction",
    reviews: 15400,
    pages: 372,
    publisher: "Riverhead Books",
    publishedDate: "2003-05-29",
    isbn: "9781594631931",
  },
  {
    title: "1984",
    author: "George Orwell",
    price: 14.99,
    stock: 30,
    description:
      "The dystopian classic of surveillance, propaganda, and the fight for truth under totalitarian rule.",
    imageUrl: cover(9267242),
    featured: true,
    bestSellers: true,
    bookRating: 4.5,
    genre: "fiction",
    reviews: 22000,
    pages: 328,
    publisher: "Signet Classic",
    publishedDate: "1950-07-01",
    isbn: "9780451524935",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 16.99,
    stock: 23,
    description:
      "A timeless novel of justice, empathy, and growing up in the American South.",
    imageUrl: cover(14351077),
    featured: true,
    bestSellers: true,
    bookRating: 4.7,
    genre: "fiction",
    reviews: 18500,
    pages: 336,
    publisher: "Harper Perennial",
    publishedDate: "1960-07-11",
    isbn: "9780061120084",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    price: 12.99,
    stock: 28,
    description:
      "Wit, romance, and social satire—Elizabeth Bennet and Mr. Darcy’s unforgettable sparring of hearts.",
    imageUrl: cover(14348537),
    featured: false,
    bestSellers: true,
    bookRating: 4.6,
    genre: "fiction",
    reviews: 16200,
    pages: 432,
    publisher: "Penguin Classics",
    publishedDate: "1813-01-28",
    isbn: "9780141439518",
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 13.5,
    stock: 27,
    description:
      "Jazz Age glamour and tragedy—the American dream glittering on Long Island’s green light.",
    imageUrl: cover(10590366),
    featured: true,
    bestSellers: false,
    bookRating: 4.4,
    genre: "fiction",
    reviews: 14100,
    pages: 180,
    publisher: "Scribner",
    publishedDate: "1925-04-10",
    isbn: "9780743273565",
  },
];

async function main() {
  // Strict rule: never seed a book without a real cover image.
  const withImages = books.filter((b) => Boolean(b.imageUrl?.trim()));
  const dropped = books.length - withImages.length;
  if (dropped > 0) {
    console.warn(`Dropped ${dropped} book(s) without imageUrl.`);
  }
  if (withImages.length === 0) {
    throw new Error("No books with images to seed.");
  }

  // Clear dependent rows first (FK RESTRICT on Book).
  await prisma.cartItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.book.deleteMany();

  await prisma.book.createMany({ data: withImages });

  const byGenre = withImages.reduce<Record<string, number>>((acc, b) => {
    acc[b.genre] = (acc[b.genre] ?? 0) + 1;
    return acc;
  }, {});

  console.log("✅ Books seeded with cover images.");
  console.log("Counts by genre:", byGenre);
  console.log(`Total: ${withImages.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
