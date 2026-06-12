"use client";

import { Box, Button, Modal } from "@/components";
import { useModal } from "@/providers";
import { useDeleteCategorySizeMutation } from "@/services/controllers/category-sizes/CategorySizesQueries";

interface DeleteProductSizeModalProps {
  sizeId: number;
  sizeName?: string | null;
}

export function DeleteProductSizeModal({
  sizeId,
  sizeName,
}: DeleteProductSizeModalProps) {
  const { closeModal } = useModal();
  const { mutate: deleteSize, isPending: isDeleting } =
    useDeleteCategorySizeMutation();

  const handleDeleteSize = () => {
    deleteSize(sizeId, { onSuccess: closeModal });
  };

  return (
    <Modal
      className="max-w-[460px] rounded-md"
      closeTitle="Close delete size confirmation"
      onClose={closeModal}
    >
      <Box className="px-7 pb-6 pt-6">
        <Modal.Title className="mb-3 min-h-0 text-base font-semibold">
          Delete size
        </Modal.Title>
        <p className="text-sm leading-6 text-[#5f564b]">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-[#183d2b]">
            {sizeName || "this size"}
          </span>
          ? This action cannot be undone.
        </p>
      </Box>

      <Modal.BottomButtons className="mt-auto justify-end border-t border-[#eadfd4] bg-[#fff3e8] px-7 py-5">
        <Button
          className="h-10 rounded-md px-5 text-xs text-[#6f6256]"
          disabled={isDeleting}
          onClick={closeModal}
          type="button"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          className="h-10 rounded-md px-5 text-xs"
          disabled={isDeleting}
          onClick={handleDeleteSize}
          type="button"
          variant="delete"
        >
          {isDeleting ? "Deleting..." : "Delete size"}
        </Button>
      </Modal.BottomButtons>
    </Modal>
  );
}
