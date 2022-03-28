import { Market_market } from '@vegaprotocol/graphql';
import classNames from 'classnames';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useState, ReactNode, ComponentType } from 'react';
import { GridTab, GridTabs } from './grid-tabs';
import { DealTicketContainer } from '../../components/deal-ticket-container';
import { OrderListContainer } from '../..//components/order-list-container';
import { Splash } from '@vegaprotocol/ui-toolkit';

const Chart = () => (
  <Splash>
    <p>Chart</p>
  </Splash>
);
const Orderbook = () => (
  <Splash>
    <p>Orderbook</p>
  </Splash>
);
const Positions = () => (
  <Splash>
    <p>Positions</p>
  </Splash>
);
const Collateral = () => (
  <Splash>
    <p>Collateral</p>
  </Splash>
);
const Trades = () => (
  <Splash>
    <p>Trades</p>
  </Splash>
);

// enum TradingView {
//   Chart = 'Chart',
//   Ticket = 'Ticket',
//   Orderbook = 'Orderbook',
//   Orders = 'Orders',
//   Positions = 'Positions',
//   Collateral = 'Collateral',
//   Trades = 'Trades',
// }

const TradingViews = {
  Chart: Chart,
  Ticket: DealTicketContainer,
  Orderbook: Orderbook,
  Orders: OrderListContainer,
  Positions: Positions,
  Collateral: Collateral,
  Trades: Trades,
};

type TradingView = keyof typeof TradingViews;

interface TradeGridProps {
  market: Market_market;
}

export const TradeGrid = ({ market }: TradeGridProps) => {
  const wrapperClasses = classNames(
    'h-full max-h-full',
    'grid gap-[1px] grid-cols-[1fr_325px_325px] grid-rows-[min-content_1fr_200px]',
    'bg-black-10 dark:bg-white-10',
    'text-ui'
  );
  return (
    <div className={wrapperClasses}>
      <header className="col-start-1 col-end-2 row-start-1 row-end-1 p-8">
        <h1>Market: {market.name}</h1>
      </header>
      <TradeGridChild className="col-start-1 col-end-2">
        <TradingViews.Chart />
      </TradeGridChild>
      <TradeGridChild className="row-start-1 row-end-3">
        <TradingViews.Ticket market={market} />
      </TradeGridChild>
      <TradeGridChild className="row-start-1 row-end-3">
        <GridTabs group="trade">
          <GridTab name="trades">
            <TradingViews.Trades />
          </GridTab>
          <GridTab name="orderbook">
            <TradingViews.Orderbook />
          </GridTab>
        </GridTabs>
      </TradeGridChild>
      <TradeGridChild className="col-span-3">
        <GridTabs group="portfolio">
          <GridTab name="orders">
            <TradingViews.Orders />
          </GridTab>
          <GridTab name="positions">
            <TradingViews.Positions />
          </GridTab>
          <GridTab name="collateral">
            <TradingViews.Collateral />
          </GridTab>
        </GridTabs>
      </TradeGridChild>
    </div>
  );
};

interface TradeGridChildProps {
  children: ReactNode;
  className?: string;
}

const TradeGridChild = ({ children, className }: TradeGridChildProps) => {
  const gridChildClasses = classNames('bg-white dark:bg-black', className);
  return (
    <section className={gridChildClasses}>
      <AutoSizer>
        {({ width, height }) => (
          <div style={{ width, height }} className="overflow-auto">
            {children}
          </div>
        )}
      </AutoSizer>
    </section>
  );
};

interface TradePanelsProps {
  market: Market_market;
}

export const TradePanels = ({ market }: TradePanelsProps) => {
  const [view, setView] = useState<TradingView>('Chart');

  const renderView = () => {
    const Component = TradingViews[view];

    if (!Component) {
      throw new Error(`No component for view: ${view}`);
    }

    return <Component market={market} />;
  };

  return (
    <div className="h-full grid grid-rows-[min-content_1fr_min-content]">
      <header className="p-8">
        <h1>Market: {market.name}</h1>
      </header>
      <div className="h-full">
        <AutoSizer>
          {({ width, height }) => (
            <div style={{ width, height }}>{renderView()}</div>
          )}
        </AutoSizer>
      </div>
      <div className="flex flex-nowrap gap-4 overflow-x-auto my-4 max-w-full">
        {Object.keys(TradingViews).map((key) => {
          const isActive = view === key;
          const className = classNames('py-4', 'px-12', 'capitalize', {
            'text-black dark:text-vega-yellow': isActive,
            'bg-white dark:bg-black': isActive,
            'text-black dark:text-white': !isActive,
            'bg-black-10 dark:bg-white-10': !isActive,
          });
          return (
            <button
              onClick={() => setView(key as TradingView)}
              className={className}
              key={key}
            >
              {key}
            </button>
          );
        })}
        <div className="bg-black-10 dark:bg-white-10 grow"></div>
      </div>
    </div>
  );
};
