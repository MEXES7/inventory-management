import Modal from "../common/Modal";
import Button from "../common/Button";

interface Props {
  open: boolean;
  loading?: boolean;
  productName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteProductDialog({
  open,
  loading,
  productName,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
      title="Delete Product"
    >
      <div className="space-y-6">
        <p className="text-gray-600">
          Are you sure you want to delete <strong>{productName}</strong>?
        </p>

        <p className="text-sm text-red-600">This action cannot be undone.</p>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
