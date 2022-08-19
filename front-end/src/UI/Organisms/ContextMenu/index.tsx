/*
 **  ContextMenu: chakra-ui-contextmenu
 **
 ** https://github.com/lukasbach/chakra-ui-contextmenu
 */

/* eslint-disable react/require-default-props */
/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  useEventListener,
  Portal,
  Menu,
  MenuButton,
  PortalProps,
  MenuButtonProps,
  MenuProps,
  EventListenerEnv,
} from '@chakra-ui/react';

export interface ContextMenuProps<T extends HTMLElement> {
  renderMenu: (isRendered: boolean) => JSX.Element | null;
  children: (ref: MutableRefObject<T | null>) => JSX.Element | null;
  menuProps?: MenuProps;
  portalProps?: PortalProps;
  menuButtonProps?: MenuButtonProps;
  env: EventListenerEnv;
}

export function ContextMenu<T extends HTMLElement = HTMLElement>(
  props: ContextMenuProps<T>,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isDeferredOpen, setIsDeferredOpen] = useState(false);
  const [position, setPosition] = useState<[number, number]>([0, 0]);
  const targetRef = useRef<T>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setIsRendered(true);
        setTimeout(() => {
          setIsDeferredOpen(true);
        });
      });
    } else {
      setIsDeferredOpen(false);
      const timeout = setTimeout(() => {
        setIsRendered(isOpen);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEventListener(
    'click',
    (e) => {
      if (
        !targetRef.current?.contains(e.target as any) &&
        e.target !== targetRef.current
      ) {
        if (isOpen) {
          setIsOpen(false);
        }
      }
    },
    props.env,
  );

  useEventListener('contextmenu', (e) => {
    if (
      targetRef.current?.contains(e.target as any) ||
      e.target === targetRef.current
    ) {
      e.preventDefault();
      setIsOpen(true);
      setPosition([e.pageX, e.pageY]);
    } else {
      setIsOpen(false);
    }
  });

  const onCloseHandler = useCallback(() => {
    props.menuProps?.onClose?.();
    setIsOpen(false);
  }, [props.menuProps?.onClose, setIsOpen]);

  return (
    <>
      {props.children(targetRef)}
      {isRendered && (
        <Portal {...props.portalProps} containerRef={targetRef}>
          <Menu
            isOpen={isDeferredOpen}
            gutter={0}
            {...props.menuProps}
            onClose={onCloseHandler}
            closeOnSelect={false}
            closeOnBlur={false}
          >
            <MenuButton
              aria-hidden
              w={1}
              h={1}
              style={{
                position: 'fixed',
                left: position[0],
                top: position[1],
                cursor: 'default',
              }}
              {...props.menuButtonProps}
            />
            {props.renderMenu(isDeferredOpen)}
          </Menu>
        </Portal>
      )}
    </>
  );
}
