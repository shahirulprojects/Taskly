"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SplashCursor from "@/components/ui/splashcursor";
import Aurora from "@/components/ui/aurora";

const formSchema = z.object({
  activity: z.string().min(2, {
    message: "Activity must be at least 2 characters.",
  }),
  price: z.coerce.number().min(0, {
    message: "Price must be a positive number.",
  }),
  type: z.enum(
    [
      "education",
      "recreational",
      "social",
      "diy",
      "charity",
      "cooking",
      "relaxation",
      "music",
      "busywork",
    ],
    {
      message: "Please select a valid activity type.",
    }
  ),
  bookingRequired: z.boolean().default(false),
  accessibility: z.number().min(0).max(1).default(0.5),
});

export default function ToDoListPage() {
  return (
    <div className="relative flex flex-col  items-center h-screen bg-black text-white">
      <Aurora
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={0.5}
        amplitude={1.5}
        speed={0.5}
      />
      <h1 className="text-2xl font-bold mb-5">Todo List</h1>
      <ProfileForm />
    </div>
  );
}

function ProfileForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activity: "",
      price: 0,
      type: "education",
      bookingRequired: false,
      accessibility: 0.5,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="activity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activity</FormLabel>
              <FormControl>
                <Input placeholder="Enter activity" {...field} />
              </FormControl>
              <FormDescription>
                what activity do you want to add?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                how much does this activity cost?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="recreational">Recreational</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="diy">DIY</SelectItem>
                  <SelectItem value="charity">Charity</SelectItem>
                  <SelectItem value="cooking">Cooking</SelectItem>
                  <SelectItem value="relaxation">Relaxation</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="busywork">Busywork</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>what type of activity is this?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bookingRequired"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Booking Required</FormLabel>
                <FormDescription>
                  does this activity require booking ahead of time?
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accessibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accessibility (0.0 - 1.0)</FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={1}
                  step={0.1}
                  defaultValue={[field.value]}
                  onValueChange={(vals) => field.onChange(vals[0])}
                />
              </FormControl>
              <FormDescription>
                how accessible is this activity? (0 = most accessible, 1 = least
                accessible)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
