"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Input from "../form/input/InputField";
import Pagination from "../UsersTable/Pagination";
import { fetchGarents } from "@/api/garent";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import GarentPopup from "@/components/garent/invite/page";

export default function GarentsTable() {
  const [garents, setGarents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // modal state

  const reloadGarents = async () => {
    try {
      const params: any = {
        page: currentPage,
        size: 10,
      };

      if (search.trim()) {
        params.firstName = search;
        params.lastName = search;
      }

      const response = await fetchGarents(params);
      setGarents(response.data);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error("Error fetching garents:", err);
    }
  };

  useEffect(() => {
    reloadGarents();
  }, [search, currentPage]);

  return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white text-black dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-white">
        <div className="p-4 flex flex-wrap items-center justify-between gap-4">
          <Input
              placeholder="Search by name"
              className="bg-transparent max-w-md"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
          />

          <Button
              onClick={() => setIsPopupOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <Plus size={18} />
            Add Garent
          </Button>
        </div>

        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader className="sticky top-0 bg-white dark:bg-black z-10 border-b border-gray-100 dark:border-white/[0.05] shadow-sm">
                <TableRow>
                  <TableCell className="px-5 py-3 font-medium">First Name</TableCell>
                  <TableCell className="px-5 py-3 font-medium">Last Name</TableCell>
                  <TableCell className="px-5 py-3 font-medium">Phone Number</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {garents.length === 0 ? (
                    <TableRow>
                      <td colSpan={3} className="text-center py-4">
                        No garents found.
                      </td>
                    </TableRow>
                ) : (
                    garents.map((garent) => (
                        <TableRow key={garent.garentId}>
                          <TableCell className="px-5 py-4">{garent.firstName}</TableCell>
                          <TableCell className="px-5 py-4">{garent.lastName}</TableCell>
                          <TableCell className="px-5 py-4">{garent.phoneNumber}</TableCell>
                        </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex justify-center py-4">
          <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
          />
        </div>

        <GarentPopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            onSuccess={() => {
              setIsPopupOpen(false);
              reloadGarents();
            }}
        />
      </div>
  );
}
