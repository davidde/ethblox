import ErrorIndicator from '@/components/common/indicators/error-indicator';
import LoadingIndicator from '@/components/common/indicators/loading-indicator';
import LoadingPulse from '@/components/common/indicators/loading-pulse';
import RefetchIndicator from '@/components/common/indicators/refetch-indicator';
import { ReactNode, useRef, useMemo, useEffect } from 'react';
import { useFetch } from '../constructors/data-state';
import { DataState, RenderConfig } from '../types';
import { RenderError } from '../types/errors';


export function getRender<T>(dataState: DataState<T>) {
  const Render = <K extends keyof T>(conf: RenderConfig<T, K> = {}): ReactNode => {
    const {
      children, field, staticContent, showFallback = true,
      loadingMessage, loadingPulseColor, showLoadingCallback = true, loadingCallback,
      error, showErrorCallback = true, errorCallback, showErrorSubstitute, errorSubstitute,
      className
    } = conf;

    switch (dataState.status) {
      case 'loading':
        if (showFallback) {
          if (showLoadingCallback && loadingCallback) return loadingCallback(className);
          else if (loadingMessage) return <LoadingIndicator message={loadingMessage} className={className} />;
          else return <LoadingPulse loadingPulseColor={loadingPulseColor} content={staticContent} className={className} />;
        } return;
      case 'value':
        if (typeof children === 'function') {
          let value;
          try {
            value = children(dataState.value, className);
          } catch (err) {
            // Most likely some data that should have been present in the response was absent,
            // but we cannot be sure, so we'll just display an ErrorIndicator with refetch button,
            // without setting the entire DataState to an ErrorState:
            const error = new RenderError(`'children' render prop pattern function failed.
             Some fields may be incorrectly missing from the response.
             Response: ${JSON.stringify(dataState.value)}`,
              { cause: err }
            );
            console.error(error);
            value = <ErrorIndicator error='RenderError' refetch={dataState.fetch} className={className} />
          }
          return value;
        } else if (field) {
          return <span className={className}>{ String(dataState.value[field]) }</span>;
        } else if (staticContent) {
          return <span className={className}>{ staticContent }</span>;
        } else return <span className={className}>{ String(dataState.value) }</span>;
      case 'error':
        // When only the staticContent prop was provided for the Render function,
        // the staticContent should be displayed regardless of possible errors,
        // since the errors have nothing to do with the static content to be displayed:
        if (!children && !field && staticContent) {
          return <span className={className}>{ staticContent }</span>;
        }
        else if (showFallback) {
          if (showErrorCallback && errorCallback) return errorCallback(className);
          if (showErrorSubstitute) return <RefetchIndicator message={errorSubstitute} refetch={dataState.fetch} className={className} />;
          else return <ErrorIndicator error={error} refetch={dataState.fetch} className={className} />;
        } return;
    }
  }

  return Render;
}
