import {useDisclosure} from "@mantine/hooks";
import {useState} from "react";


type DialogProps ={
    data:never
}
export const useAppDialog = () => {

    const [dialogOpened, { open, close }] =
        useDisclosure(false);

    const [dialogProps,setDialogProps]=useState<DialogProps>();

    function openDialog(data?:any){
        open();
        setDialogProps(
            data
        );
    }
    function closeDialog(){
        close();
    }


    return {
        dialogOpened,
        dialogProps,
        openDialog,closeDialog
    }
}