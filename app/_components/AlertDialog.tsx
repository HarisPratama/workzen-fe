import {
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogPortal, AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogDescription,
    AlertDialog, AlertDialogCancel, AlertDialogAction, AlertDialogFooter
} from "@/app/_components/ui/alert-dialog";

type Props = {
    triggerText?: string;
    title: string;
    description?: string;
    cancelText?: string;
    actionText: string;
    open?: boolean;
    onSubmit?: () => void;
}

const AlertDialogComponent  = ({ triggerText, title, description, cancelText, actionText, open, onSubmit }: Props) => {

    return (
        <AlertDialog open={open}>
            {triggerText && <AlertDialogTrigger>{triggerText}</AlertDialogTrigger>}
            <AlertDialogPortal>
                <AlertDialogOverlay/>
                <AlertDialogContent>
                    <AlertDialogTitle>
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                        <div style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}>
                            {cancelText && <AlertDialogCancel asChild>
                                {cancelText}
                            </AlertDialogCancel>}
                            <AlertDialogAction  onClick={onSubmit}>
                                {actionText}
                            </AlertDialogAction>
                        </div>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogPortal>
        </AlertDialog>
    )
}

export default AlertDialogComponent
