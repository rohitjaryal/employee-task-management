import { Modal } from "@mantine/core";
import { ReactNode } from "react";

interface AppDialogProps {
  opened: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
}
export const AppDialog = (props: AppDialogProps) => {
  const { opened, title, onClose, children } = props;
  return (
    <Modal
      centered
      size="lg"
      opened={opened}
      onClose={onClose}
      title={title}
      overlayProps={{
        backgroundOpacity: 0.6,
        blur: 1,
      }}
    >
      {children}
    </Modal>
  );
};
