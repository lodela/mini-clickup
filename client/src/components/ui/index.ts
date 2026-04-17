/**
 * UI Components Barrel Export
 *
 * Central export point for all UI components
 * Import from this file to use components throughout the application
 *
 * @example
 * import { Button, Input, Card } from '@/components/ui';
 */

// Utilities
export { cn } from "./utils";

// Button
export { Button, buttonVariants } from "./button";
export type { ButtonProps } from "./button";

// Input
export { Input } from "./input";
export type { InputProps } from "./input";

// Card
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";
export type { CardProps } from "./card";
export type {
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from "./card";

// Alert
export { Alert, AlertTitle, AlertDescription } from "./alert";
export type {
  AlertProps,
  AlertTitleProps,
  AlertDescriptionProps,
} from "./alert";
