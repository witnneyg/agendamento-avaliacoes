-- CreateTable
CREATE TABLE "_DisciplineTeachers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DisciplineTeachers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DisciplineTeachers_B_index" ON "_DisciplineTeachers"("B");

-- AddForeignKey
ALTER TABLE "_DisciplineTeachers" ADD CONSTRAINT "_DisciplineTeachers_A_fkey" FOREIGN KEY ("A") REFERENCES "Discipline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DisciplineTeachers" ADD CONSTRAINT "_DisciplineTeachers_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
