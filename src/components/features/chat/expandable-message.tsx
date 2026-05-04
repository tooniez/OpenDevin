import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import ArrowDown from "#/icons/angle-down-solid.svg?react";
import ArrowUp from "#/icons/angle-up-solid.svg?react";
import CheckCircle from "#/icons/check-circle-solid.svg?react";
import { OpenHandsAction } from "#/types/core/actions";
import { OpenHandsObservation } from "#/types/core/observations";
import { cn } from "#/utils/utils";
import { MarkdownRenderer } from "../markdown/markdown-renderer";
import { MonoComponent } from "./mono-component";
import { PathComponent } from "./path-component";

const trimText = (text: string, maxLength: number): string => {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

interface ExpandableMessageProps {
  id?: string;
  message: string;
  type: string;
  success?: boolean;
  observation?: { payload: OpenHandsObservation };
  action?: { payload: OpenHandsAction };
}

export function ExpandableMessage({
  id,
  message,
  type,
  success,
  observation,
  action,
}: ExpandableMessageProps) {
  const { i18n } = useTranslation("openhands");
  const [showDetails, setShowDetails] = useState(true);
  const [details, setDetails] = useState(message);
  const [translationId, setTranslationId] = useState<string | undefined>(id);
  const [translationParams, setTranslationParams] = useState<
    Record<string, unknown>
  >({
    observation,
    action,
  });

  useEffect(() => {
    // If we have a translation ID, process it
    if (id && i18n.exists(id, { ns: "openhands" })) {
      let processedObservation = observation;
      let processedAction = action;

      if (action && action.payload.action === "run") {
        const trimmedCommand = trimText(action.payload.args.command, 80);
        processedAction = {
          ...action,
          payload: {
            ...action.payload,
            args: {
              ...action.payload.args,
              command: trimmedCommand,
            },
          },
        };
      }

      if (observation && observation.payload.observation === "run") {
        const trimmedCommand = trimText(observation.payload.extras.command, 80);
        processedObservation = {
          ...observation,
          payload: {
            ...observation.payload,
            extras: {
              ...observation.payload.extras,
              command: trimmedCommand,
            },
          },
        };
      }

      setTranslationId(id);
      setTranslationParams({
        observation: processedObservation,
        action: processedAction,
      });
      setDetails(message);
      setShowDetails(false);
    }
  }, [id, message, observation, action, i18n.language]);

  const statusIconClasses = "h-4 w-4 ml-2 inline";

  return (
    <div
      className={cn(
        "flex gap-2 items-center justify-start border-l-2 pl-2 my-2 py-2",
        type === "error" ? "border-danger" : "border-neutral-300",
      )}
    >
      <div className="text-sm w-full">
        <div className="flex flex-row justify-between items-center w-full">
          <span
            className={cn(
              "font-bold",
              type === "error" ? "text-danger" : "text-neutral-300",
            )}
          >
            {translationId &&
            i18n.exists(translationId, { ns: "openhands" }) ? (
              <Trans
                ns="openhands"
                i18nKey={translationId}
                values={translationParams}
                components={{
                  bold: <strong />,
                  path: <PathComponent />,
                  cmd: <MonoComponent />,
                }}
              />
            ) : (
              message
            )}
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="cursor-pointer text-left"
            >
              {showDetails ? (
                <ArrowUp
                  className={cn(
                    "h-4 w-4 ml-2 inline",
                    type === "error" ? "fill-danger" : "fill-neutral-300",
                  )}
                />
              ) : (
                <ArrowDown
                  className={cn(
                    "h-4 w-4 ml-2 inline",
                    type === "error" ? "fill-danger" : "fill-neutral-300",
                  )}
                />
              )}
            </button>
          </span>
          {type === "action" && success && (
            <span className="flex-shrink-0">
              <CheckCircle
                data-testid="status-icon"
                className={cn(statusIconClasses, "fill-success")}
              />
            </span>
          )}
        </div>
        {showDetails && (
          <div className="text-sm">
            <MarkdownRenderer includeStandard>{details}</MarkdownRenderer>
          </div>
        )}
      </div>
    </div>
  );
}
