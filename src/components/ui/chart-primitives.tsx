"use client"

import * as React from "react"
import {
  Area,
  Bar,
  Line,
  Pie,
  Radar,
  RadialBar,
  type AreaProps,
  type BarProps,
  type LineProps,
  type PieProps,
  type RadarProps,
  type RadialBarProps,
} from "recharts"
import {
  AreaChart as AreaChartPrimitive,
  BarChart as BarChartPrimitive,
  LineChart as LineChartPrimitive,
  PieChart as PieChartPrimitive,
  RadarChart as RadarChartPrimitive,
  RadialBarChart as RadialBarChartPrimitive,
  type AreaChartProps as AreaChartPrimitiveProps,
  type BarChartProps as BarChartPrimitiveProps,
  type LineChartProps as LineChartPrimitiveProps,
  type PieChartProps as PieChartPrimitiveProps,
  type RadarChartProps as RadarChartPrimitiveProps,
  type RadialBarChartProps as RadialBarChartPrimitiveProps,
  type TooltipProps,
} from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartTooltipContentProps,
  ChartTooltipFormatter,
  ChartTooltipProps,
} from "@/components/ui/chart-tooltip"

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config?: {
      [key in string]: {
        label?: React.ReactNode
        color?: string
        icon?: React.ComponentType
      }
    }
  }
>(({ id, className, children, config, ...props }, ref) => {
  const chartId = `chart-${id}`

  return (
    <div
      data-chart
      ref={ref}
      id={chartId}
      className={cn(
        "group/chart relative flex aspect-video flex-col justify-between overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
ChartContainer.displayName = "ChartContainer"

const createChart = <T extends React.ComponentType<any>>(
  ChartComponent: T,
  {
    defaultProps,
  }: {
    defaultProps?: Partial<React.ComponentProps<T>>
  } = {}
) => {
  const Comp = React.forwardRef<
    React.ElementRef<T>,
    React.ComponentProps<T> & {
      data: any[]
      /**
       * The key for the x-axis.
       */
      index: string
      /**
       * The keys for the y-axis.
       */
      categories: string[]
      /**
       * The colors for the categories.
       */
      colors?: string[]
      /**
       * The component to render for the tooltip.
       */
      tooltip?: React.ReactElement<
        TooltipProps<any, any> & {
          content: React.ComponentType<ChartTooltipContentProps>
        }
      >
      /**
       * Props to pass to the tooltip content.
       */
      tooltipProps?: Partial<ChartTooltipContentProps>
      /**
      * The formatter for the tooltip values.
      */
      valueFormatter?: ChartTooltipFormatter
    }
  >(
    (
      {
        data,
        className,
        children,
        index,
        categories,
        colors,
        tooltip = <ChartTooltip />,
        tooltipProps,
        valueFormatter,
        ...props
      },
      ref
    ) => {
      const config = React.useMemo(() => {
        const newConfig: React.ComponentProps<
          typeof ChartContainer
        >["config"] = {}
        categories.forEach((category, i) => {
          newConfig[category] = {
            color: colors?.[i]
              ? `var(--theme-${colors[i]})`
              : `hsl(var(--chart-${i + 1}))`,
          }
        })
        return newConfig
      }, [categories, colors])

      const chartId = React.useId()

      return (
        <ChartContainer
          config={config}
          id={chartId}
          ref={ref}
          className={cn("[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/50", className)}
          {...props}
        >
          {React.cloneElement(
            tooltip,
            {
              ...tooltip.props,
              content:
                tooltip.props.content ??
                ((props) => (
                  <ChartTooltipContent
                    {...props}
                    {...tooltipProps}
                    valueFormatter={valueFormatter}
                    config={config}
                  />
                )),
            },
            tooltip.props.children
          )}
          {children}
        </ChartContainer>
      )
    }
  )
  Comp.displayName = ChartComponent.displayName

  return Comp as typeof Comp
}

const AreaChart = createChart(AreaChartPrimitive)
const BarChart = createChart(BarChartPrimitive)
const LineChart = createChart(LineChartPrimitive)

const createPieChart = <T extends React.ComponentType<any>>(
  ChartComponent: T
) => {
  const Comp = React.forwardRef<
    React.ElementRef<T>,
    React.ComponentProps<T> & {
      data: any[]
      /**
       * The key for the category.
       */
      category: string
      /**
       * The key for the value.
       */
      value: string
      /**
       * The colors for the categories.
       */
      colors?: string[]
      /**
       * The component to render for the tooltip.
       */
      tooltip?: React.ReactElement<
        TooltipProps<any, any> & {
          content: React.ComponentType<ChartTooltipContentProps>
        }
      >
      /**
       * Props to pass to the tooltip content.
       */
      tooltipProps?: Partial<ChartTooltipContentProps>
      /**
      * The formatter for the tooltip values.
      */
      valueFormatter?: ChartTooltipFormatter
    }
  >(
    (
      {
        data,
        className,
        children,
        category,
        value,
        colors,
        tooltip = <ChartTooltip />,
        tooltipProps,
        valueFormatter,
        ...props
      },
      ref
    ) => {
      const config = React.useMemo(() => {
        const newConfig: React.ComponentProps<
          typeof ChartContainer
        >["config"] = {}
        data.forEach((_, i) => {
          const key = data[i][category]
          newConfig[key] = {
            color: colors?.[i]
              ? `var(--theme-${colors[i]})`
              : `hsl(var(--chart-${i + 1}))`,
          }
        })
        return newConfig
      }, [category, data, colors])

      const chartId = React.useId()

      return (
        <ChartContainer
          config={config}
          id={chartId}
          ref={ref}
          className={cn("[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/50", className)}
          {...props}
        >
          {React.cloneElement(
            tooltip,
            {
              ...tooltip.props,
              content:
                tooltip.props.content ??
                ((props) => (
                  <ChartTooltipContent
                    {...props}
                    {...tooltipProps}
                    valueFormatter={valueFormatter}
                    config={config}
                    indicator="dot"
                    nameKey={category}
                  />
                )),
            },
            tooltip.props.children
          )}
          {children}
        </ChartContainer>
      )
    }
  )

  Comp.displayName = ChartComponent.displayName

  return Comp
}

const PieChart = createPieChart(PieChartPrimitive)
const RadialChart = createPieChart(RadialBarChartPrimitive)

const createChartY = <T extends React.ComponentType<any>>(
  ChartComponent: T
) => {
  const Comp = React.forwardRef<
    React.ElementRef<T>,
    React.ComponentProps<T> & {
      data: any[]
      /**
       * The key for the y-axis.
       */
      index: string
      /**
       * The keys for the x-axis.
       */
      categories: string[]
      /**
       * The colors for the categories.
       */
      colors?: string[]
      /**
       * The component to render for the tooltip.
       */
      tooltip?: React.ReactElement<
        TooltipProps<any, any> & {
          content: React.ComponentType<ChartTooltipContentProps>
        }
      >
      /**
       * Props to pass to the tooltip content.
       */
      tooltipProps?: Partial<ChartTooltipContentProps>
      /**
       * The formatter for the tooltip values.
       */
      valueFormatter?: ChartTooltipFormatter
    }
  >(
    (
      {
        data,
        className,
        children,
        index,
        categories,
        colors,
        tooltip = <ChartTooltip />,
        tooltipProps,
        valueFormatter,
        ...props
      },
      ref
    ) => {
      const config = React.useMemo(() => {
        const newConfig: React.ComponentProps<
          typeof ChartContainer
        >["config"] = {}
        categories.forEach((category, i) => {
          newConfig[category] = {
            color: colors?.[i]
              ? `var(--theme-${colors[i]})`
              : `hsl(var(--chart-${i + 1}))`,
          }
        })
        return newConfig
      }, [categories, colors])

      const chartId = React.useId()

      return (
        <ChartContainer
          config={config}
          id={chartId}
          ref={ref}
          className={cn("[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/50", className)}
          {...props}
        >
          {React.cloneElement(
            tooltip,
            {
              ...tooltip.props,
              content:
                tooltip.props.content ??
                ((props) => (
                  <ChartTooltipContent
                    {...props}
                    {...tooltipProps}
                    valueFormatter={valueFormatter}
                    config={config}
                  />
                )),
            },
            tooltip.props.children
          )}
          {children}
        </ChartContainer>
      )
    }
  )

  Comp.displayName = ChartComponent.displayName

  return Comp
}

const BarChartY = createChartY(BarChartPrimitive)

export {
  ChartContainer,
  AreaChart,
  BarChart,
  BarChartY,
  LineChart,
  PieChart,
  RadialChart,
}
export type {
  AreaChartPrimitiveProps,
  AreaProps,
  BarChartPrimitiveProps,
  BarProps,
  ChartTooltipContentProps,
  ChartTooltipFormatter,
  ChartTooltipProps,
  LineChartPrimitiveProps,
  LineProps,
  PieChartPrimitiveProps,
  PieProps,
  RadarChartPrimitiveProps,
  RadarProps,
  RadialBarChartPrimitiveProps,
  RadialBarProps,
}

    