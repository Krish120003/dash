import { zodResolver } from "@hookform/resolvers/zod";
import { LocationType } from "@prisma/client";
import React, { FormEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { z } from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const SaveLocation: React.FC = () => {
  const [selectedLocationType, setSelectedLocationType] = useState<string>(""); // State to store the selected location

  const [currentLocation, setCurrentLocation] =
    useState<GeolocationCoordinates>();
  const [error, setError] = useState<string>();
  const saveLocation = api.location.saveLocation.useMutation();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation(position.coords);
      },
      (error) => {
        setError(error.message);
      },
    );
  }, []);

  const FormSchema = z.object({
    location: z.nativeEnum(LocationType, {
      required_error: "Please select a location",
    }),
    radius: z.string().nonempty({ message: "Please select a radius" }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      radius: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    // write to db using trpc endpiont
    console.log(selectedLocationType);
    const type =
      selectedLocationType === "HOME"
        ? LocationType.HOME
        : selectedLocationType === "WORK"
        ? LocationType.WORK
        : LocationType.SCHOOL;
    if (currentLocation?.latitude && currentLocation?.longitude) {
      await saveLocation.mutateAsync({
        type: data.location,
        coordinates: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
        radius: Number.parseInt(data.radius),
      });
    }
  }

  return (
    <Popover>
      <PopoverTrigger>Location</PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Please select a location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="HOME">Home</SelectItem>
                      <SelectItem value="WORK">Work</SelectItem>
                      <SelectItem value="SCHOOL">School</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="radius"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Radius</FormLabel>
                  <FormControl>
                    <Input placeholder="100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};

export default SaveLocation;
