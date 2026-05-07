
"use client"

import * as React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TooltipProps, TooltipContentProps } from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

/* -----------------------------------------------------------------------------
 * Exported types
 * -------------------------------------------------------------------------- */

export type ChartTooltipFormatter = (
  value: number,
  name: string,
  payload: any
) => { value: string; name: string }

export type ChartTooltipProps = TooltipProps

/* -----------------------------------------------------------------------------
 * Component: ChartTooltip
 * -------------------------------------------------------------------------- */

export const ChartTooltip = React.forwardRef<
  React.ElementRef<typeof Tooltip>,
  ChartTooltipProps
>(({ ...props }, ref) => <Tooltip ref={ref} {...props} />)
ChartTooltip.displayName = "ChartTooltip"

/* -----------------------------------------------------------------------------
 * Component: ChartTooltipContent
 * -------------------------------------------------------------------------- */

export type ChartTooltipContentProps = TooltipContentProps &
  Pick<
    NonNullable<React.ComponentProps<"div">["aria-live"]>,
    "aria-live" | "aria-label"
  > & {
    payload?: any[]
    label?: any
    /**
     * The formatter for the tooltip values.
     */
    valueFormatter?: ChartTooltipFormatter
    /**
     * The indicator for the tooltip.
     * Can be a dot, line, or none.
     */
    indicator?: "dot" | "line" | "none"
    /**
     * If true, the tooltip will hide the indicator.
     */
    hideIndicator?: boolean
    /**
     * If true, the tooltip will hide the label.
     */
    hideLabel?: boolean
    /**
     * The key to use for the name of the tooltip item.
     */
    nameKey?: string
    /**
     * The config for the chart.
     */
    config?: {
      [key in string]: {
        label?: React.ReactNode
        color?: string
        icon?: React.ComponentType
      }
    }
  }

export const ChartTooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipContent>,
  ChartTooltipContentProps
>(
  (
    {
      className,
      payload,
      label,
      "aria-live": ariaLive = "assertive",
      "aria-label": ariaLabel = "Chart tooltip",
      valueFormatter,
      indicator = "dot",
      hideIndicator = false,
      hideLabel = false,
      nameKey,
      config,
      ...props
    },
    ref
  ) => {
    const formatted = React.useMemo(() => {
      if (!payload || !payload.length) return null

      return payload.map((item, i) => {
        const { name, value } = item
        const {
          value: formattedValue,
          name: formattedName,
        } =
          valueFormatter?.(value, name, item) ??
          (typeof value === "number"
            ? {
                value: new Intl.NumberFormat("en-US").format(value),
                name,
              }
            : { value, name })

        const key = nameKey ? item.payload[nameKey] : formattedName

        return {
          ...item,
          name: key,
          color: config?.[key]?.color,
          value: formattedValue,
        }
      })
    }, [payload, valueFormatter, nameKey, config])

    if (!formatted) return null

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div />
          </TooltipTrigger>
          <TooltipContent
            ref={ref}
            className={cn("tabular-nums", className)}
            {...props}
          >
            <div
              aria-live={ariaLive}
              aria-label={ariaLabel}
              role="status"
              className="grid gap-1.5"
            >
              {!hideLabel && label && <div className="font-medium">{label}</div>}
              {formatted.map((item, i) => {
                const isNone = indicator === "none" || hideIndicator
                const isDot = indicator === "dot"
                const isLine = indicator === "line"

                return (
                  <div
                    key={item.name}
                    className="flex min-w-[8rem] items-center"
                  >
                    {!isNone && (
                      <div
                        className={cn("me-2 shrink-0", {
                          "h-2.5 w-2.5 rounded-full": isDot,
                          "h-4 w-px": isLine,
                        })}
                        style={{
                          backgroundColor: item.color,
                        }}
                      />
                    )}
                    <div className="grid flex-1 grid-cols-2 items-center">
                      <span className="text-muted-foreground">{item.name}</span>
                      <span className="ms-auto font-medium">{item.value}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"
