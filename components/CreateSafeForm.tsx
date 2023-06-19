import {useForm} from "@mantine/form";
import {ethers} from "ethers";
import {
    ActionIcon,
    Button,
    Grid,
    NumberInput,
    TextInput,
} from "@mantine/core";
import {IconTrash} from "@tabler/icons-react";
import SafeAuthContext from "@/context/SafeAuthContext";
import {useContext, useState} from "react";
import axios from "axios";
import {showNotification, updateNotification} from "@mantine/notifications";
import {useRouter} from "next/router";

export default function CreateSafeForm() {
    const safeContext = useContext(SafeAuthContext);
    const router = useRouter();

    const [submitting, setSubmitting] = useState(false);

    const form = useForm({
        initialValues: {
            name: "",
            description: "",
            owners: [{address: safeContext.safeAuthSignInResponse?.eoa}],
            threshold: 1,
        },
        validate: {
            owners: {
                address: (value) =>
                    ethers.utils.isAddress(value!)
                        ? undefined
                        : "Invalid address",
            },
        },
        validateInputOnChange: true,
    });

    const handleFormSubmit = async (values: {
        name: string;
        description: string;
        owners: { address: string | undefined }[];
        threshold: number;
    }) => {
        setSubmitting(true)
        showNotification({
            id: "create-safe",
            title: "Creating Safe...",
            message: "Please wait while we create your Safe",
            loading: true,
            autoClose: false,
        });
        const owners = values.owners.map((owner) => owner.address);
        try {
            const response = await axios.post("/api/createSafe", {
                threshold: values.threshold,
                owners: owners,
                chainId: safeContext.safeAuthSignInResponse?.chainId,
            });
            const safeAddress = response.data.safeAddress;
            console.log(safeAddress);

            updateNotification({
                id: "create-safe",
                title: "Safe created!",
                message: `Safe created at ${safeAddress}`,
                autoClose: true,
                color: "green",
            });
            setSubmitting(false)
            setTimeout(() => {
                router.push(`/safe?address=${safeAddress}`);
            }, 1500)
        } catch (e) {
            console.log(e);
            updateNotification({
                id: "create-safe",
                title: "Error creating Safe",
                message: `Error creating Safe: ${e}`,
                autoClose: true,
                color: "red",
            });
            setSubmitting(false)
        }
    };

    return (
        <form
            onSubmit={form.onSubmit(
                async (values) => await handleFormSubmit(values)
            )}
        >
            <NumberInput
                min={1}
                placeholder={
                    "Minimum number of owners required to confirm a transaction"
                }
                label="Threshold"
                required
                {...form.getInputProps(`threshold`)}
            />
            {form.values.owners.map((owner, index) => {
                return (
                    <Grid key={index} my={"xs"}>
                        <Grid.Col span={11}>
                            <TextInput
                                placeholder={"Owner address"}
                                label={`Owner ${index + 1}`}
                                {...form.getInputProps(
                                    `owners.${index}.address`
                                )}
                            />
                        </Grid.Col>
                        <Grid.Col
                            span={1}
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <ActionIcon
                                color={"gray"}
                                variant={"subtle"}
                                onClick={() => {
                                    form.removeListItem(`owners`, index);
                                }}
                            >
                                <IconTrash/>
                            </ActionIcon>
                        </Grid.Col>
                    </Grid>
                );
            })}
            <Button
                onClick={() => {
                    form.insertListItem(`owners`, {address: ""});
                }}
            >
                Add owner
            </Button>
            <br/>
            <Button loading={submitting} fullWidth type="submit" color="red" mt="md">
                Create Safe
            </Button>
        </form>
    );
}