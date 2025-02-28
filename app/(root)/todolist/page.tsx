"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import React from "react";

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
import { Card, CardContent } from "@/components/ui/card";

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

// define the todo item type
type TodoItem = z.infer<typeof formSchema> & { id: string };

export default function ToDoListPage() {
  // state to store our todo items
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  // Add a state to track client-side rendering
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // load todo items from localStorage on component mount - only run on client
  useEffect(() => {
    if (isClient) {
      const savedTodos = localStorage.getItem("todoItems");
      if (savedTodos) {
        try {
          setTodoItems(JSON.parse(savedTodos));
        } catch (e) {
          console.error("Failed to parse saved todos:", e);
        }
      }
    }
  }, [isClient]);

  // save todo items to localStorage whenever they change - only run on client
  useEffect(() => {
    if (isClient && todoItems.length > 0) {
      localStorage.setItem("todoItems", JSON.stringify(todoItems));
    }
  }, [todoItems, isClient]);

  // function to delete an item from the list
  const handleDeleteItem = (id: string) => {
    setTodoItems(todoItems.filter((item) => item.id !== id));
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen overflow-hidden bg-black text-white py-10">
      <SplashCursor />
      <h1 className="text-4xl font-bold my-8">Todo List</h1>
      <div className="w-full max-w-md">
        <ToDoForm onAddTodo={(todo) => setTodoItems([...todoItems, todo])} />

        {todoItems.length > 0 ? (
          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Activities</h2>
              <span className="bg-emerald-500 text-black font-medium px-3 py-1 rounded-full text-sm">
                {todoItems.length} {todoItems.length === 1 ? "item" : "items"}
              </span>
            </div>
            {/* Only render the list on the client side to avoid hydration mismatch */}
            {isClient &&
              todoItems.map((item) => (
                <Card key={item.id} className="bg-black border-emerald-400">
                  <CardContent className="p-4 flex justify-between items-center text-white">
                    <div>
                      <h3 className="font-medium text-lg">{item.activity}</h3>
                      <div className="text-sm text-gray-400 mt-1">
                        <p>Type: {item.type}</p>
                        <p>Price: ${item.price}</p>
                        <p>
                          Booking required:{" "}
                          {item.bookingRequired ? "Yes" : "No"}
                        </p>
                        <p>Accessibility: {item.accessibility.toFixed(1)}</p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteItem(item.id)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : (
          <p className="text-center mt-8 text-gray-400">
            {isClient
              ? "No activities added yet. Add one above!"
              : "Loading..."}
          </p>
        )}
      </div>
    </div>
  );
}

function ToDoForm({ onAddTodo }: { onAddTodo: (todo: TodoItem) => void }) {
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
    // create a new todo item with a unique ID
    const newTodo: TodoItem = {
      ...values,
      id: crypto.randomUUID(),
    };

    // add the new todo to the list
    onAddTodo(newTodo);

    // reset the form
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="activity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activity</FormLabel>
              <FormControl>
                <Input placeholder="Enter activity" {...field} />
              </FormControl>
              <FormDescription className="text-gray-400">
                What activity do you want to add?
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
                  onChange={(e) => {
                    const value = e.target.value;
                    // only parse to float if there's an actual value, otherwise use 0 or empty string
                    field.onChange(value === "" ? "" : parseFloat(value));
                  }}
                  // ensure React never gets NaN as a value
                  value={
                    field.value === null || isNaN(field.value)
                      ? ""
                      : field.value
                  }
                />
              </FormControl>
              <FormDescription className="text-gray-400">
                How much does this activity cost?
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
              <FormDescription className="text-gray-400">
                What type of activity is this?
              </FormDescription>
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
                <FormDescription className="text-gray-400">
                  Does this activity require booking ahead of time?
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
              <FormDescription className="text-gray-400">
                How accessible is this activity? (0 = most accessible, 1 = least
                accessible)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Add Activity
        </Button>
      </form>
    </Form>
  );
}
