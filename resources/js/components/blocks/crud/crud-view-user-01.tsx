"use client";

import { ArrowLeft, Edit, MoreHorizontal, Share2, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ACTIVITY = [
  {
    user: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&auto=format&fit=crop",
    action: "updated product details",
    time: "2 hours ago",
  },
  {
    user: "Mike Johnson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&auto=format&fit=crop",
    action: "changed status to Active",
    time: "1 day ago",
  },
  {
    user: "Emma Davis",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&auto=format&fit=crop",
    action: "created this product",
    time: "3 days ago",
  },
];

export const title = "Product Detail View";

export default function CrudViewDetails01() {
  return (
    <div className="container mx-auto py-16 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">Wireless Noise-Canceling Headphones</h1>
              <Badge>Active</Badge>
            </div>
            <p className="text-muted-foreground">
              Premium audio experience with industry-leading noise cancellation
            </p>
          </div>

          <div className="flex gap-2">
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem>Export</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="related">Related Items</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Product Image</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium mb-1">SKU</p>
                    <p className="text-muted-foreground">WH-1000XM5</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Category</p>
                    <p className="text-muted-foreground">Electronics</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Price</p>
                    <p className="text-muted-foreground">$399.99</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Stock</p>
                    <p className="text-muted-foreground">156 units</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium mb-2">Description</p>
                  <p className="text-muted-foreground text-sm">
                    Experience legendary noise cancellation with our premium wireless headphones.
                    Featuring industry-leading technology, exceptional sound quality, and
                    all-day comfort. Perfect for travel, work, and everything in between.
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Features</p>
                  <ul className="space-y-1">
                    {["30-hour battery life", "Quick charge capability", "Multi-device pairing", "Touch sensor controls"].map((feature) => (
                      <li key={feature} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Created</p>
                    <p className="font-medium">Dec 10, 2024</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground mb-1">Last Modified</p>
                    <p className="font-medium">Dec 14, 2024</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground mb-1">Created By</p>
                    <p className="font-medium">Emma Davis</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground mb-1">Product ID</p>
                    <p className="font-mono text-xs">prod_abc123xyz</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {["Wireless", "Audio", "Premium", "Bestseller"].map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {ACTIVITY.map((event, i) => (
                  <div key={i} className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={event.avatar} alt={event.user} />
                      <AvatarFallback>{event.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">{event.user}</span>{" "}
                        <span className="text-muted-foreground">{event.action}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Related Items Tab */}
        <TabsContent value="related">
          <Card>
            <CardHeader>
              <CardTitle>Related Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-2">
                    <div className="aspect-video bg-muted rounded" />
                    <p className="font-medium">Related Product {i}</p>
                    <p className="text-sm text-muted-foreground">$299.99</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Product Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Configure product-specific settings and preferences
              </p>
              {/* Settings content would go here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
