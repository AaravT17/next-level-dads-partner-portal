import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import PhoneInput, {isPossiblePhoneNumber} from "react-phone-number-input/input";
import { useState } from "react";
import {createEvent} from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";

type EventForm = {
    name: string;
    description: string | null;
    type: "local" | "virtual";
    starts_at: string | null;
    ends_at: string | null;
    location: string;
    latitude: number | "";
    longitude: number | "";
    contact_email: string | null;
    contact_phone: string | null;
    price_cad: number;
}

function EventApplication() {
    const [response, setResponse] = useState<string | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { accessToken } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        control
    } = useForm<EventForm>({
        defaultValues: {
            name: "",
            description: null,
            type: "local",
            starts_at: null,
            ends_at: null,
            location: "",
            latitude: "",
            longitude: "",
            contact_email: null,
            contact_phone: null,
            price_cad: 0,
        }
    })

    const onSubmit: SubmitHandler<EventForm> = async (data: EventForm) => {
        setIsSubmitting(true);
        const payload = {
            name: data.name.trim(),
            description: data.description?.trim() || null,
            type: data.type,
            starts_at: data.starts_at ? new Date(data.starts_at).toISOString() : null,
            ends_at: data.ends_at ? new Date(data.ends_at).toISOString() : null,
            location: data.location.trim(),
            latitude: data.latitude === "" ? null : data.latitude,
            longitude: data.longitude === "" ? null : data.longitude,
            contact_email: data.contact_email?.trim() || null,
            contact_phone: data.contact_phone || null,
            price_cad: data.price_cad
        }

        console.log(payload);

        try {
            const result = await createEvent(payload, accessToken);

            setResponse(result?.id);
            setIsSubmitting(false);
            
            if (result) {
                navigate('/events',
                    {
                        state: {eventId: result?.id}
                    }
                );
            };
        }
        catch (err) {
            toast.error("Error submitting application, please try again.", {
                position: 'top-right'
            });
        }
    }


    return (
        <div className="page-container">
            <div className="content-container">
                <h2 className="content-subheader">Event Application</h2>
                <h1 className="content-header">New Event</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="event-form flex flex-col my-10 px-3 py-4 lg:px-6 lg:py-8">

                    <label className="required-label">Event Name:
                        <input 
                            type="text"
                            className="mt-1 w-full md:ml-4 md:w-1/2 md:mt-0"
                            placeholder="My First Event"
                            {...register("name", {required: "Event name is required", maxLength: 100})} 
                        />
                    </label>
                    {errors?.name && <span className="error-msg">{errors?.name?.message}</span>}

                    <div className="mt-6">
                        <p className="required-label">Event Type:</p>
                        <div className="flex gap-8">
                            <label>Local
                                <input 
                                    type="radio"    
                                    value="local"
                                    className="w-3 ml-2" 
                                    {...register("type", { required: true })} 
                                />
                            </label>

                            <label>Virtual
                                <input 
                                    type="radio" 
                                    value="virtual" 
                                    className="w-3 ml-2"
                                    {...register("type", { required: true })} 
                                />
                            </label>
                        </div>
                    </div>
                    {errors?.type && <span className="error-msg">Event type is required</span>}

                    <label className="mt-6">
                        <p className="mb-2">Description:</p>
                        <textarea 
                            className="rounded-lg w-full h-35 resize-none md:w-3/4"
                            placeholder="A place for dads to interact!"
                            {...register("description", {maxLength: 1000})} 
                        />
                    </label>
                    
                    <div className="flex flex-col mt-6 gap-6 lg:flex-row lg:w-3/4">
                        <div className="flex flex-col flex-1">
                            <label className="required-label">Starts At:
                                <input
                                    type="datetime-local"
                                    className="mt-1 w-full text-base md:ml-4 md:w-2/3 md:mt-0"
                                    placeholder=""
                                    {...register("starts_at", {required: "Start time is required"})} 
                                />    
                            </label>
                            {errors?.starts_at && <span className="error-msg">{errors?.starts_at?.message}</span>}
                        </div>

                        <div className="flex flex-col flex-1">
                            <label className="">Ends At:
                                <input 
                                    type="datetime-local" 
                                    className="mt-1 w-full md:ml-4 md:w-2/3 md:mt-0"
                                    placeholder="" 
                                    {...register("ends_at", {
                                        validate: (value, formValues) => { 
                                            if (!value) return true;
                                            if (!formValues.starts_at) return true;
                                            
                                            return (
                                                new Date(value) > new Date(formValues.starts_at) || "End time must be after start time"
                                            )
                                        }
                                    })} 
                                    />
                            </label>
                            {errors?.ends_at && <span className="error-msg">{errors?.ends_at?.message}</span>}
                        </div>
                    </div>


                    <label className="mt-6 required-label">Location:
                        <input 
                            type="text" 
                            className="mt-1 w-full md:ml-4 md:w-1/2 md:mt-0"
                            placeholder="" 
                            {...register("location", {
                                    required: "Location information is required", 
                                    maxLength: 500
                            })} 
                        />
                    </label>
                    {errors?.location && <span className="error-msg">{errors?.location?.message}</span>}

                    <div className="flex flex-col mt-6 gap-6 lg:flex-row lg:w-3/4">
                        <label className="flex-1">Latitude:
                            <input 
                                type="number"
                                step="any"
                                className="mt-1 w-full md:ml-4 md:w-2/3 md:mt-0"
                                placeholder="" 
                                {...register("latitude")} 
                            />
                        </label>
                    
                        <label className="flex-1">Longitude:
                            <input 
                                type="number" 
                                step="any"
                                className="mt-1 w-full md:ml-4 md:w-2/3 md:mt-0"
                                placeholder="" 
                                {...register("longitude")} 
                            />
                        </label>
                    </div>

                    <div className="flex flex-col mt-6 gap-6 lg:flex-row lg:w-3/4">
                        <div className="flex-1">
                            <label className="">Contact Email:
                                <input 
                                    type="email" 
                                    className="mt-1 w-full md:ml-4 md:w-1/2 md:mt-0"
                                    placeholder="example@email.com" 
                                    {...register("contact_email", {
                                            maxLength: 254,
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Please enter a valid email address"
                                            }
                                    })} 
                                />
                            </label>
                            {errors?.contact_email && <span className="error-msg">{errors?.contact_email?.message}</span>}
                        </div>
                        
                        <div className="flex-1">
                            <label className="">Contact Phone:
                                <Controller
                                    name="contact_phone"
                                    control={control}
                                    rules={{
                                        validate: (value) => !value || isPossiblePhoneNumber(`${value}`) || "Please enter a valid phone number"
                                    }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <PhoneInput
                                                placeholder="(555) 123-4567"
                                                className="mt-1 w-full md:ml-4 md:w-1/2 md:mt-0" 
                                                country="US"
                                                value={field.value}
                                                onChange={(value) => field.onChange(value ?? "")}
                                            />
                                            {fieldState?.error && (
                                                <p className="error-msg text-base">{fieldState?.error?.message}</p>
                                            )}
                                        </>
                                    )}
                                >
                                </Controller>
                            </label>

                        </div>
                    </div>


                    <label className="mt-6 required-label">Price (CAD): $
                        <input 
                            type="number"
                            step="any"
                            className="mt-1 w-full md:ml-4 md:w-1/4 md:mt-0"
                            placeholder="0" 
                            {...register("price_cad", {required: "Event price is required"})} 
                        />
                    </label>
                    {errors?.price_cad && <span className="error-msg">{errors?.price_cad.message}</span>}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`btn mt-9 self-center-safe lg:self-auto`}
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    )

}

export default EventApplication;