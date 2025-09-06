-- CreateTable
CREATE TABLE "_CourseDisciplines" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CourseDisciplines_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CourseDisciplines_B_index" ON "_CourseDisciplines"("B");

-- AddForeignKey
ALTER TABLE "_CourseDisciplines" ADD CONSTRAINT "_CourseDisciplines_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseDisciplines" ADD CONSTRAINT "_CourseDisciplines_B_fkey" FOREIGN KEY ("B") REFERENCES "Discipline"("id") ON DELETE CASCADE ON UPDATE CASCADE;
