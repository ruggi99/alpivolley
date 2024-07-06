import { Fragment } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import cs from "classnames";

function MyDialog({ children, onClose, show, title, ...rest }) {
  return (
    <Transition show={show} as={Fragment}>
      <Dialog
        className="fixed inset-0 z-10 grid items-center overflow-y-auto"
        {...rest}
        onClose={onClose}
      >
        {/* <Transition.Child
          as={Fragment}
          enterFrom="opacity-0"
          enterTo="opacity-30"
          entered="opacity-30"
          leaveFrom="opacity-30"
          leaveTo="opacity-0"
          enter="duration-200 transition"
          leave="duration-200 transition"
        >
          <DialogBackdrop className="fixed inset-0 bg-black" />
        </Transition.Child> */}
        <Transition.Child
          as={Fragment}
          enterFrom="opacity-0 scale-90"
          enterTo="opacity-100 scale-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-90"
          enter="duration-200 transition"
          leave="duration-200 transition"
        >
          <div className="mx-auto w-full max-w-2xl place-items-center px-4">
            <div className="rounded-lg bg-white shadow dark:bg-gray-700">
              <Title onClose={onClose}>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {title}
                </span>
              </Title>
              {children}
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

function Title({ children, className, onClose, ...rest }) {
  return (
    <Dialog.Title
      className={cs(
        "flex items-center justify-between rounded-t border-b p-5 dark:border-gray-600",
        className,
      )}
      {...rest}
    >
      {children}
      <button
        type="button"
        className="inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
        onClick={onClose}
        aria-label="Annulla"
      >
        <XMarkIcon className="h-6 w-6" />
      </button>
    </Dialog.Title>
  );
}

function Body({ className, ...rest }) {
  return <div className={cs("space-y-6 p-6", className)} {...rest} />;
}

function Footer({ className, ...rest }) {
  return (
    <div
      className={cs(
        "flex items-center justify-end gap-2 rounded-b border-t border-gray-200 p-6 dark:border-gray-600",
        className,
      )}
      {...rest}
    />
  );
}

MyDialog.Title = Title;
MyDialog.Body = Body;
MyDialog.Footer = Footer;

export default MyDialog;
